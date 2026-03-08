import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const number = "918870226867";
  const text = encodeURIComponent("Hi! I have a query about Kalai Fashions.");

  return (
    <a
      href={`https://wa.me/${number}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} />
    </a>
  );
};

export default WhatsAppButton;
