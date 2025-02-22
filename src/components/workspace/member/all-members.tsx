import { Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // adjust import path as needed
import { toast } from "@/hooks/use-toast";// or your preferred toast library
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useQuery } from "@tanstack/react-query";
import { getAllFarmersQueryFn, deleteFarmerMutationFn } from "@/lib/api";

const AllMembers = () => {
  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useQuery({
    queryKey: ['farmers', workspaceId],
    queryFn: () => getAllFarmersQueryFn({ workspaceId }),
  });

  return (
    <div className="grid gap-6 pt-2">
      {isLoading ? (
        <Loader className="w-8 h-8 animate-spin place-self-center flex" />
      ) : null}

      {data?.farmers?.map((farmer: any) => {
        const name = farmer.fullName;
        const initials = getAvatarFallbackText(name);
        const avatarColor = getAvatarColor(name);

        // Function to handle deletion
        const handleDelete = async () => {
          try {
            await deleteFarmerMutationFn({
              workspaceId,
              farmerId: farmer._id,
            });
            toast({
              title: "Success",
              description: "Farmer deleted successfully",
              variant: "success",
            });
          } catch (error) {
            toast({
              title: "Error",
              description: (error as Error).message,
              variant: "destructive",
            });
          }
        };

        return (
          <div key={farmer._id} className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={farmer.profilePicture || ""}
                  alt="Image"
                />
                <AvatarFallback className={avatarColor}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-sm text-muted-foreground">
                  Tel: {farmer.phoneNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View More Dropdown for Farmer Details */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="link" size="sm">
                    View More
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div>
                    <p className="text-sm">Farmer's Additional Details</p>
                    <p><strong>Land Area:</strong> {farmer.landArea}</p>
                    <p>
                      <strong>Joined Date:</strong>{" "}
                      {new Date(farmer.joinedDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Avg Yield Sold:</strong> {farmer.avgYieldSoldToMarket}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Delete Member Button with Confirmation */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Confirm Deletion
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this Cooperative member? This action is irreversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllMembers;
