import type { PermissionGroupDto } from '../../../api/admin/types'

type Props = {
  groups: PermissionGroupDto[]
  selectedIds: number[]
  onChange: (ids: number[]) => void
}

export function PermissionPicker({ groups, selectedIds, onChange }: Props) {
  function toggle(id: number) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  if (groups.length === 0) {
    return <p className="admin-table-state">No permission groups loaded.</p>
  }

  return (
    <div className="admin-permission-picker">
      {groups.map((group) => (
        <div key={group.id} className="admin-permission-picker__group">
          <p className="admin-permission-picker__group-title">{group.name}</p>
          {group.permissions.length === 0 ? (
            <p className="admin-table-state">No permissions in this group.</p>
          ) : (
            <ul className="admin-permission-picker__list">
              {group.permissions.map((perm) => (
                <li key={perm.id}>
                  <label className="admin-check">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(perm.id)}
                      onChange={() => toggle(perm.id)}
                    />
                    <span>
                      {perm.name} <code>{perm.code}</code>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
