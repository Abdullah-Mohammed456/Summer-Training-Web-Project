import { getAdminUsers } from '../../../src/lib/api';

const tbody = document.getElementById('users-tbody');

const appendStatusRow = (message: string): void => {
  if (!tbody) return;
  const row = document.createElement('tr');
  const cell = document.createElement('td');
  cell.colSpan = 4;
  cell.textContent = message;
  row.append(cell);
  tbody.replaceChildren(row);
};

if (tbody) {
  appendStatusRow('Loading…');
  void getAdminUsers()
    .then((users) => {
      const rows = users.map((profile) => {
        const row = document.createElement('tr');
        const values = [
          profile.displayName ?? '-',
          new Date(profile.createdAt).toLocaleString(),
          profile.email ?? '-',
          profile.uid,
        ];
        values.forEach((value) => {
          const cell = document.createElement('td');
          cell.textContent = value;
          row.append(cell);
        });
        return row;
      });
      tbody.replaceChildren(...rows);
      if (rows.length === 0) appendStatusRow('No users found.');
    })
    .catch(() => appendStatusRow('Unable to load users.'));
}
