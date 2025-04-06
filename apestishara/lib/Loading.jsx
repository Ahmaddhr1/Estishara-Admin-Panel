import { Loader2 } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center flex-col">
        <Loader2 className="animate-spin w-10 h-10 mb-2" />
        <p>Please Wait...</p>
      </div>
  )
}

export default Loading