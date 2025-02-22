import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateMemberForm from "./new-member-form";

const AddMemberDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Button>
            <Plus />
            Add Member
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg max-h-auto my-5 border-0">
          <CreateMemberForm onClose={onClose}/>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddMemberDialog;