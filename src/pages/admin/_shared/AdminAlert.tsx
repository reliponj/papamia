type Props = {
  message: string
}

export function AdminAlert({ message }: Props) {
  return (
    <p className="admin-alert" role="alert">
      {message}
    </p>
  )
}
