import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import { TaskType } from "@/types/api.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { deleteTaskMutationFn, updateTaskMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface DataTableRowActionsProps {
  row: Row<TaskType>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [openDeleteDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const taskId = row.original._id as string;
  const taskCode = row.original.taskCode;
  const projectId = row.original.project?._id as string; // Assuming projectId exists in the row data

  // Mutation for deleting a task
  const { mutate: deleteTask, isPending: isDeleting } = useMutation({
    mutationFn: deleteTaskMutationFn,
  });

  // Mutation for updating a task (Approving Loan)
  const { mutate: approveLoan, isPending: isApproving } = useMutation({
    mutationFn: updateTaskMutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["all-tasks", workspaceId] });
      toast({
        title: "Success",
        description: data.message,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleApproveLoan = () => {
    approveLoan({
      taskId,
      workspaceId,
      projectId,
      data: { status: "DONE", priority: "HIGH" },
    });
  };

  const handleConfirmDelete = () => {
    deleteTask(
      {
        workspaceId,
        taskId,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ["all-tasks", workspaceId],
          });
          toast({
            title: "Success",
            description: data.message,
            variant: "success",
          });
          setTimeout(() => setOpenDialog(false), 100);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={handleApproveLoan}
            disabled={isApproving}
          >
            {isApproving ? "Approving..." : "Approve Loan"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={`!text-destructive cursor-pointer ${taskId}`}
            onClick={() => setOpenDialog(true)}
          >
            Delete Loan
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        isOpen={openDeleteDialog}
        isLoading={isDeleting}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Loan"
        description={`Are you sure you want to delete ${taskCode}?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}