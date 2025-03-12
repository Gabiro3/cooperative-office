import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createFarmerMutationFn } from "@/lib/api"; // Adjust the import as needed
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox"; // For data usage agreement checkbox
import useWorkspaceId from "@/hooks/use-workspace-id";
import { toast } from "@/hooks/use-toast";

export default function CreateMemberForm(props: {
  onClose: () => void;
}) {
  const { onClose } = props;

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId(); // Assuming this hook fetches the current workspace ID

  // Use the mutation function from react-query
  const { mutate, isPending } = useMutation({
    mutationFn: createFarmerMutationFn,
    onSuccess: () => {
      // Adjust based on how you're querying farmers
      onClose(); // Close the form after success
    },
    onError: (error) => {
      console.error("Error creating farmer:", error);
      // Handle any error state if necessary
    },
  });

  // Form validation schema
  const formSchema = z.object({
    fullName: z.string().trim().min(1, {
      message: "Full name is required",
    }),
    phoneNumber: z.string().trim().min(1, {
      message: "Phone number is required",
    }),
    email: z.string().email({
      message: "Please enter a valid email address",
    }).default("members.dataseedafrica@gmail.com"),
    farmDetails: z.string().trim().min(1, {
      message: "Farm details are required",
    }),
    memberType: z.string().trim().min(1, {
        message: "Farm details are required",
      }),
    avgYield: z.string().trim().min(1, {
        message: "Average yield is required",
      }),
    nationalId: z.string().trim().min(1, {
      message: "National ID number is required",
    }),
    agreesToDataPolicy: z.boolean().refine((val) => val === true, {
      message: "You must agree to the data usage policy",
    }),
    // Add the missing properties here:
    landArea: z.number().refine((val) => !isNaN(val), {
      message: "Land area is required",
    }),
    joinedDate: z.date({
      required_error: "Joined date is required",
    }),
  });
  

  // Initialize the form using react-hook-form and the validation schema
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "member.dataseedafrica@gmail.com",
      fullName: "",
      phoneNumber: "",
      farmDetails: "",
      memberType: "farmer",
      landArea: 0,
      avgYield: "0",
      cooperativeId: workspaceId,
      nationalId: "",
      agreesToDataPolicy: false,
      joinedDate: new Date(),
    },
  });

  // Define the onSubmit function
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;
  
    // Prepare the data to match what is expected by the mutation
    const farmerData = {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        farmDetails: values.farmDetails,
        memberType: values.memberType, // Ensure this is correctly passed as 'farmer' or 'animal rearer'
        nationalId: values.nationalId,
        agreesToDataPolicy: values.agreesToDataPolicy,
        landArea: values.landArea, // Added field
        avgYieldSoldToMarket: values.avgYield, // Ensure it's a number
        cooperativeId: workspaceId, // Added field
        joinedDate: values.joinedDate.toISOString(), // Ensure it's in ISO string format
      };
  
    // Call the mutation function to create the farmer
    const payload = {
      workspaceId,
      data: farmerData,
    };
  
    mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["farmers", workspaceId], // Adjust according to the query keys you're using
        });
        toast({
          title: "Success",
          description: "Farmer created successfully",
          variant: "success",
        });
        onClose();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };
  

  return (
    <div className="w-full h-auto max-w-full">
      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter full name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter phone number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email (default set to dataseedafrica@gmail.com) */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter email address" disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
  control={form.control}
  name="landArea"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Land Area (Ha)</FormLabel>
      <FormControl>
        <Input 
          {...field} 
          placeholder="Enter land area" 
          type="number"
          onChange={(e) => field.onChange(e.target.valueAsNumber)}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


          {/* Farm Details */}
          <FormField
            control={form.control}
            name="farmDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Farm Details</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter farm details" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Member Type */}
          <FormField
            control={form.control}
            name="memberType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Member Type</FormLabel>
                <Select {...field}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select member type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">Farmer</SelectItem>
                    <SelectItem value="animal rearer">Animal Rearer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Average Yield */}
          <FormField
            control={form.control}
            name="avgYield"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Average Yield Sold to Market</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter average yield" type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* National ID */}
          <FormField
            control={form.control}
            name="nationalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>National ID Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter national ID number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Data Usage Policy Agreement */}
          <FormField
            control={form.control}
            name="agreesToDataPolicy"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="ml-2">I agree to the data usage policy</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="mt-4" type="submit" disabled={isPending}>
            Register Member
          </Button>
        </form>
      </Form>
    </div>
  );
}
