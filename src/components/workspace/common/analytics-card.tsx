import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowBigUp, ArrowBigDown, Loader } from "lucide-react";

const AnalyticsCard = (props: {
  title: string;
  value: number;
  isLoading: boolean;
}) => {
  const { title, value, isLoading } = props;

  const getArrowIcon = () => {
    if (title === "Approved Loans (Rwf)" || title === "Pending Loans (Rwf)") {
      return value > 0 ? (
        <ArrowBigUp strokeWidth={2.5} className="h-4 w-4 text-green-500" />
      ) : (
        <ArrowBigDown strokeWidth={2.5} className="h-4 w-4 text-red-500" />
      );
    }
    if (title === "Total Members" || title === "Total Loans (Rwf)") {
      return value > 0 ? (
        <ArrowBigUp strokeWidth={2.5} className="h-4 w-4 text-blue-500" />
      ) : (
        <ArrowBigDown strokeWidth={2.5} className="h-4 w-4 text-yellow-500" />
      );
    }
    return null;
  };  
  return (
    <Card className="shadow-none w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-1">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="mb-[0.2px]">{getArrowIcon()}</div>
        </div>
        <Activity
          strokeWidth={2.5}
          className="h-4 w-4  text-muted-foreground"
        />
      </CardHeader>
      <CardContent className="w-full">
      <div className="text-2xl font-bold">
  {isLoading ? (
    <Loader className="w-6 h-6 animate-spin" />
  ) : (
    new Intl.NumberFormat('en-US', { style: 'decimal' }).format(value)
  )}
</div>

      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
