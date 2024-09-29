import React from 'react'

interface MessageCardProps {
  title: string
  message: string
}

const MessageCard: React.FC<MessageCardProps> = ({ title, message }) => {
  return (
    <div className="flex items-center justify-center my-8">
      <div className="text-center p-8 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}

export default MessageCard
