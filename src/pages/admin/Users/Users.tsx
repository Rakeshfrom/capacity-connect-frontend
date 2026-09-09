import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { getUsers, updateUser } from '../../../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'TRAINEE' | 'TRAINER' | 'ADMIN';
  department: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt: string;
  updatedAt: string;
}

interface UserForm {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: User['role'];
  department: string;
  status: User['status'];
}

const emptyForm: UserForm = {
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  role: 'TRAINEE',
  department: '',
  status: 'ACTIVE',
};

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadUsers = () => {
    getUsers()
      .then((data: User[]) => {
        setUsers(data);
        setError('');
      })
      .catch(() => {
        setError('Unable to load users from the backend.');
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesRole =
        roleFilter === 'ALL' || user.role === roleFilter;

      const matchesStatus =
        statusFilter === 'ALL' || user.status === statusFilter;

      const matchesSearch =
        !value ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(value) ||
        user.username.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value);

      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [users, roleFilter, statusFilter, search]);

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setForm({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      department: user.department || '',
      status: user.status,
    });
  };

  const closeEdit = () => {
    setSelectedUser(null);
    setForm(emptyForm);
  };

  const updateForm = (field: keyof UserForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveUser = async () => {
    if (!selectedUser) return;

    setSaving(true);
    setError('');

    try {
      await updateUser(selectedUser.id, form);

      closeEdit();
      loadUsers();
    } catch {
      setError('Unable to update user.');
    } finally {
      setSaving(false);
    }
  };

  const roleCounts = {
    trainees: users.filter((user) => user.role === 'TRAINEE').length,
    trainers: users.filter((user) => user.role === 'TRAINER').length,
    admins: users.filter((user) => user.role === 'ADMIN').length,
  };

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: '#0B5A91',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Admin Portal
          </Typography>

          <Typography
            sx={{
              color: '#173F60',
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.6rem' },
              mt: 0.5,
            }}
          >
            Users
          </Typography>

          <Typography sx={{ color: '#657887', mt: 1 }}>
            Manage platform users, roles and account status.
          </Typography>
        </Box>

        {error && (
          <Box
            sx={{
              mb: 2.5,
              p: 2,
              borderRadius: 2,
              bgcolor: '#FFF4F2',
              border: '1px solid #F3C7C1',
            }}
          >
            <Typography sx={{ color: '#B42318', fontWeight: 600 }}>
              {error}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(3, 1fr)',
            },
            gap: 2.5,
            mb: 3,
          }}
        >
          {[
            ['Trainees', roleCounts.trainees],
            ['Trainers', roleCounts.trainers],
            ['Admins', roleCounts.admins],
          ].map(([label, value]) => (
            <Card
              key={label}
              elevation={0}
              sx={{
                border: '1px solid #DCE8F0',
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography sx={{ color: '#657887' }}>
                      {label}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#173F60',
                        fontWeight: 800,
                        fontSize: '1.8rem',
                        mt: 0.4,
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: 1.5,
                      bgcolor: '#EAF4FB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0B5A91',
                    }}
                  >
                    <PeopleOutlineOutlinedIcon />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Card
          elevation={0}
          sx={{
            border: '1px solid #DCE8F0',
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              sx={{ mb: 3 }}
            >
              <TextField
                fullWidth
                label="Search users"
                placeholder="Name, username or email"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={roleFilter}
                  label="Role"
                  onChange={(event) => setRoleFilter(event.target.value)}
                >
                  <MenuItem value="ALL">All roles</MenuItem>
                  <MenuItem value="TRAINEE">Trainee</MenuItem>
                  <MenuItem value="TRAINER">Trainer</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <MenuItem value="ALL">All status</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: 850 }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 90px',
                    gap: 2,
                    px: 2,
                    py: 1.5,
                    bgcolor: '#F5F8FA',
                    borderRadius: 1.5,
                  }}
                >
                  {[
                    'User',
                    'Email',
                    'Role',
                    'Department',
                    'Status',
                    'Action',
                  ].map((heading) => (
                    <Typography
                      key={heading}
                      sx={{
                        color: '#657887',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                      }}
                    >
                      {heading}
                    </Typography>
                  ))}
                </Box>

                <Stack spacing={0}>
                  {filteredUsers.map((user) => (
                    <Box
                      key={user.id}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns:
                          '2fr 2fr 1fr 1fr 1fr 90px',
                        gap: 2,
                        alignItems: 'center',
                        px: 2,
                        py: 2,
                        borderBottom: '1px solid #E4ECF1',
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{ color: '#173F60', fontWeight: 700 }}
                        >
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography
                          sx={{
                            color: '#657887',
                            fontSize: '0.82rem',
                            mt: 0.3,
                          }}
                        >
                          @{user.username}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{
                          color: '#657887',
                          fontSize: '0.9rem',
                          wordBreak: 'break-word',
                        }}
                      >
                        {user.email}
                      </Typography>

                      <Chip
                        label={user.role}
                        size="small"
                        sx={{
                          width: 'fit-content',
                          bgcolor: '#EAF4FB',
                          color: '#0B5A91',
                          fontWeight: 700,
                        }}
                      />

                      <Typography
                        sx={{
                          color: '#657887',
                          fontSize: '0.9rem',
                        }}
                      >
                        {user.department || '—'}
                      </Typography>

                      <Chip
                        label={user.status}
                        size="small"
                        sx={{
                          width: 'fit-content',
                          bgcolor:
                            user.status === 'ACTIVE'
                              ? '#EAF6EF'
                              : user.status === 'PENDING'
                                ? '#FFF6E5'
                                : '#F1F3F5',
                          color:
                            user.status === 'ACTIVE'
                              ? '#147A45'
                              : user.status === 'PENDING'
                                ? '#9A6700'
                                : '#657887',
                          fontWeight: 700,
                        }}
                      />

                      <Button
                        size="small"
                        startIcon={<EditOutlinedIcon />}
                        onClick={() => openEdit(user)}
                        sx={{
                          color: '#0B5A91',
                          fontWeight: 700,
                          textTransform: 'none',
                        }}
                      >
                        Edit
                      </Button>
                    </Box>
                  ))}
                </Stack>

                {filteredUsers.length === 0 && (
                  <Box sx={{ py: 6, textAlign: 'center' }}>
                    <Typography sx={{ color: '#657887' }}>
                      No users found.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Dialog
          open={Boolean(selectedUser)}
          onClose={closeEdit}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{ color: '#173F60', fontWeight: 800 }}
          >
            Edit User
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2.2} sx={{ pt: 1 }}>
              <TextField
                label="Username"
                value={form.username}
                onChange={(event) =>
                  updateForm('username', event.target.value)
                }
                fullWidth
              />

              <TextField
                label="Email"
                value={form.email}
                onChange={(event) =>
                  updateForm('email', event.target.value)
                }
                fullWidth
              />

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
              >
                <TextField
                  label="First Name"
                  value={form.firstName}
                  onChange={(event) =>
                    updateForm('firstName', event.target.value)
                  }
                  fullWidth
                />

                <TextField
                  label="Last Name"
                  value={form.lastName}
                  onChange={(event) =>
                    updateForm('lastName', event.target.value)
                  }
                  fullWidth
                />
              </Stack>

              <TextField
                label="Department"
                value={form.department}
                onChange={(event) =>
                  updateForm('department', event.target.value)
                }
                fullWidth
              />

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
              >
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={form.role}
                    label="Role"
                    onChange={(event) =>
                      updateForm('role', event.target.value)
                    }
                  >
                    <MenuItem value="TRAINEE">Trainee</MenuItem>
                    <MenuItem value="TRAINER">Trainer</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={form.status}
                    label="Status"
                    onChange={(event) =>
                      updateForm('status', event.target.value)
                    }
                  >
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="INACTIVE">Inactive</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={closeEdit}
              sx={{
                color: '#657887',
                textTransform: 'none',
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={saveUser}
              disabled={saving}
              sx={{
                bgcolor: '#0B5A91',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#084A77',
                },
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminUsers;
