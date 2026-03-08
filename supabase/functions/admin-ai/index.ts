import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify user is admin
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader || "" } },
    });
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role using service role client
    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden: admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, payload } = await req.json();

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "sales-insights": {
        // Fetch recent orders
        const { data: orders } = await adminClient
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        const orderSummary = (orders || []).map((o: any) => ({
          order_number: o.order_number,
          total: o.total_amount,
          status: o.status,
          payment: o.payment_status,
          date: o.created_at,
          items_count: Array.isArray(o.items) ? o.items.length : 0,
        }));

        systemPrompt = `You are a senior e-commerce analytics expert for "Kalai Fashions", an Indian ethnic fashion store. Provide actionable sales insights, trends, and recommendations. Use markdown formatting with headers, bullet points, and bold text. Include specific numbers and percentages.`;
        userPrompt = `Analyze these recent orders and provide:\n1. **Revenue Summary** (total, average order value)\n2. **Order Status Breakdown**\n3. **Payment Trends**\n4. **Top Recommendations** for increasing sales\n5. **Predicted trends** for the next week\n\nOrders data:\n${JSON.stringify(orderSummary, null, 2)}`;
        break;
      }

      case "generate-description": {
        const { productName, category, keywords, tone } = payload;
        systemPrompt = `You are a professional e-commerce copywriter specializing in Indian ethnic fashion (sarees, lehengas, kurtas, etc). Write compelling, SEO-optimized product descriptions. Use markdown formatting.`;
        userPrompt = `Generate a product description for:\n- **Product**: ${productName}\n- **Category**: ${category || "General"}\n- **Keywords**: ${keywords || "elegant, traditional"}\n- **Tone**: ${tone || "premium & elegant"}\n\nProvide:\n1. A catchy **Title** (under 80 chars)\n2. A **Short Description** (1-2 lines for cards)\n3. A **Full Description** (3-4 paragraphs, rich with details about fabric, design, occasions)\n4. **SEO Tags** (5-8 comma-separated keywords)`;
        break;
      }

      case "chatbot": {
        const { messages: chatMessages } = payload;

        // Fetch context data
        const [ordersRes, reviewsRes, couponsRes] = await Promise.all([
          adminClient.from("orders").select("order_number, total_amount, status, payment_status, created_at").order("created_at", { ascending: false }).limit(20),
          adminClient.from("reviews").select("product_id, rating, comment, created_at").order("created_at", { ascending: false }).limit(20),
          adminClient.from("coupons").select("code, discount_type, discount_value, is_active, used_count").limit(20),
        ]);

        systemPrompt = `You are an AI admin assistant for "Kalai Fashions" e-commerce store. You have access to live store data to answer questions about orders, reviews, coupons, and general business queries. Be helpful, concise, and use markdown formatting.\n\nLive Data:\n- Recent Orders: ${JSON.stringify(ordersRes.data || [])}\n- Recent Reviews: ${JSON.stringify(reviewsRes.data || [])}\n- Coupons: ${JSON.stringify(couponsRes.data || [])}`;

        // For chatbot, use streaming
        const aiMessages = [
          { role: "system", content: systemPrompt },
          ...(chatMessages || []),
        ];

        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: aiMessages,
            stream: true,
          }),
        });

        if (!response.ok) {
          const status = response.status;
          if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
          if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
          throw new Error(`AI gateway error: ${status}`);
        }

        return new Response(response.body, {
          headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
        });
      }

      case "inventory-alerts": {
        const { products } = payload;
        systemPrompt = `You are an AI inventory management expert for "Kalai Fashions". Analyze product data and provide smart inventory recommendations. Use markdown formatting with tables where appropriate.`;
        userPrompt = `Analyze this product inventory and provide:\n1. **Low Stock Alerts** (items that need restocking urgently)\n2. **Demand Prediction** (which products will likely sell fast based on trends)\n3. **Overstock Warnings** (items that may not be moving)\n4. **Reorder Recommendations** (specific quantities to order)\n5. **Seasonal Advice** (what to stock for upcoming seasons)\n\nProducts:\n${JSON.stringify(products, null, 2)}`;
        break;
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    // Non-streaming response for non-chatbot actions
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No response generated.";

    return new Response(JSON.stringify({ result: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
