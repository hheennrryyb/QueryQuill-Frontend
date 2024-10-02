import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

const SimpleDialog = ({
  triggerText,
  title,
  children,
  className
}: {
  triggerText: string
  title: string
  children: React.ReactNode
  className?: string
}) => {
  const [open, setOpen] = React.useState(false)

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button className={`${className} btn btn-secondary px-4 py-2 text-white rounded-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}>
          <p className='text-center w-full'>{triggerText}</p>
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
        <DialogPrimitive.Content className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <DialogPrimitive.Title className="text-lg font-medium">
                {title}
              </DialogPrimitive.Title>
              <DialogPrimitive.Close className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </DialogPrimitive.Close>
            </div>
            <div className="p-4 overflow-y-auto flex-grow">
              {children}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export default SimpleDialog;

// export default function DialogExample() {
//   return (
//     <div className="flex items-center justify-center h-screen">
//       <SimpleDialog triggerText="Open Dialog" title="Example Dialog">
//         <p className="mb-4">This is a simple dialog box content.</p>
//         <div className="flex justify-end">
//           <button
//             onClick={() => console.log('Action performed')}
//             className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
//           >
//             Confirm
//           </button>
//         </div>
//       </SimpleDialog>
//     </div>
//   )
// }