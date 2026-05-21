import type { RoleListDto } from '../../../api/admin/types'

type Props = {
  roles: RoleListDto[]
  selectedIds: number[]
  onChange: (ids: number[]) => void
}

export function RolePicker({ roles, selectedIds, onChange }: Props) {
  function toggle(id: number) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  return (
    <ul className="admin-permission-picker__list">
      {roles.map((role) => (
        <li key={role.id}>
          <label className="admin-check">
            <input
              type="checkbox"
              checked={selectedIds.includes(role.id)}
              onChange={() => toggle(role.id)}
            />
            <span>
              {role.name} <code>{role.code}</code>
              {role.isSystem && ' (system)'}
            </span>
          </label>
        </li>
      ))}
    </ul>
  )
}
