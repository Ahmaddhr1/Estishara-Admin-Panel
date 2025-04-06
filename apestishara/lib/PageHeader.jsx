import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

const PageHeader = ({
  name,
  buttonText,
  method,
  state,
  isFormVisible = true,
}) => {
  return (
    <div
      className={`flex ${
        isFormVisible ? "items-start" : "items-center justify-between"
      }`}
    >
      <h1 className="text-xl font-bold">{name}</h1>
      {isFormVisible && (
        <Button onClick={method} className="ml-auto">
          {state ? "Cancel" : buttonText}
          {state ? <X className="ml-2" /> : <Plus className="ml-2" />}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
