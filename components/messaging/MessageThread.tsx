import { MessageList } from "./MessageList"
import { MessageInput } from "./MessageInput"

interface MessageThreadProps {
  jobId?: string
  receiverId: string
}

export function MessageThread({ jobId, receiverId }: MessageThreadProps) {
  return (
    <div>
      <MessageList jobId={jobId} />
      <MessageInput jobId={jobId} receiverId={receiverId} onMessageSent={() => {}} />
    </div>
  )
}

