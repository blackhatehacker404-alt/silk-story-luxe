import { Package, Truck, CheckCircle, Clock, Box } from "lucide-react";

const statuses = [
  { key: "new", label: "Order Placed", icon: Clock },
  { key: "processing", label: "Processing", icon: Box },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

const statusIndex = (status: string) => statuses.findIndex((s) => s.key === status);

const OrderTimeline = ({ status, createdAt }: { status: string; createdAt: string }) => {
  const currentIdx = statusIndex(status);

  return (
    <div className="flex items-center gap-0 w-full mt-3">
      {statuses.map((step, idx) => {
        const isCompleted = idx <= currentIdx;
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon size={14} />
              </div>
              <span className={`text-[10px] mt-1 font-body text-center ${isCompleted ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
            {idx < statuses.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 ${idx < currentIdx ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
