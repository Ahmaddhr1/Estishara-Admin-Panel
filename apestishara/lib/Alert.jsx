import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; 
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
} from "@/components/ui/alert-dialog";

const Alert = ({ loading, trigger, title, des, action, func, para, Icon ,variant="destructive" }) => {
  return (
    <AlertDialog className="px-3 md:px-0">
      <AlertDialogTrigger asChild>
        <Button variant={variant} disabled={loading}>
          {Icon && <Icon className="h-4 w-4" />}
          <span className="md:flex hidden">{trigger}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{des}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="overflow-y-hidden">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => func(para)}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <span>{action}</span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;
