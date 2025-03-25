import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import React from 'react'

const PageHeader = ({name, buttonText,method,state}) => {
  return (
    <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{name}</h1>
        <Button onClick={method}>
          {state ? "Cancel": buttonText}
          {state ? <X />: <Plus className="ml-2" /> }
        </Button>
      </div>
  )
}

export default PageHeader