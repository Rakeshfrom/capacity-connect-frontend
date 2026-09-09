import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  LinearProgress,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useEffect, useState } from 'react';
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from '../../../services/api';



const Announcements = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: '',
    audience: 'All Users',
    status: 'DRAFT',
    type: 'NOTICE',
  });

  const loadAnnouncements = async () => {
    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to load announcements:', error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreate = async () => {
    if (!form.title.trim()) return;

    try {
      if (editingId !== null) {
        await updateAnnouncement(editingId, form);
      } else {
        await createAnnouncement(form);
      }

      setOpenCreate(false);
      setEditingId(null);
      setForm({
        title: '',
        audience: 'All Users',
        status: 'DRAFT',
        type: 'NOTICE',
      });
      setLoading(true);
      await loadAnnouncements();
    } catch (error) {
      console.error('Failed to save announcement:', error);
    }
  };

  const handleEdit = (announcement: any) => {
    setEditingId(announcement.id);
    setForm({
      title: announcement.title,
      audience: announcement.audience,
      status: announcement.status,
      type: announcement.type,
    });
    setOpenCreate(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAnnouncement(id);
      setLoading(true);
      await loadAnnouncements();
    } catch (error) {
      console.error('Failed to delete announcement:', error);
    }
  };

  const updateForm = (field: string, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };
  useEffect(() => {
    loadAnnouncements();
  }, []);

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
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
              Announcements
            </Typography>

            <Typography sx={{ color: '#657887', mt: 1 }}>
              Create and manage platform-wide announcements and notices.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={() => setOpenCreate(true)}
            sx={{
              bgcolor: '#0B5A91',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              py: 1.2,
              '&:hover': { bgcolor: '#084873' },
            }}
          >
            {editingId !== null ? 'Edit Announcement' : 'Create Announcement'}
          </Button>
        </Stack>

        {loading ? (
          <LinearProgress sx={{ mb: 3 }} />
        ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
            },
            gap: 2.5,
          }}
        >
          {announcements.map((announcement) => (
            <Card
              key={announcement.title}
              elevation={0}
              sx={{
                border: '1px solid #DCE8F0',
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1.5,
                      bgcolor: '#EAF4FB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <CampaignOutlinedIcon sx={{ color: '#0B5A91' }} />
                  </Box>

                  <Chip
                    label={announcement.status}
                    size="small"
                    sx={{
                      bgcolor:
                        announcement.status === 'Published'
                          ? '#EAF6EF'
                          : '#FFF3E0',
                      color:
                        announcement.status === 'Published'
                          ? '#147A45'
                          : '#A35A00',
                      fontWeight: 700,
                    }}
                  />
                </Stack>

                <Typography
                  sx={{
                    color: '#173F60',
                    fontWeight: 700,
                    fontSize: '1.08rem',
                    mt: 2.2,
                    lineHeight: 1.45,
                  }}
                >
                  {announcement.title}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                  <Chip
                    label={announcement.type}
                    size="small"
                    sx={{
                      bgcolor: '#EAF4FB',
                      color: '#0B5A91',
                      fontWeight: 600,
                    }}
                  />
                </Stack>

                <Divider sx={{ my: 2.2 }} />

                <Stack spacing={1}>
                  <Typography sx={{ color: '#657887', fontSize: '0.9rem' }}>
                    <strong>Audience:</strong> {announcement.audience}
                  </Typography>

                  <Typography sx={{ color: '#657887', fontSize: '0.9rem' }}>
                    <strong>Date:</strong> {announcement.publishedAt ? new Date(announcement.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : new Date(announcement.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
                  <Button
                    variant="outlined"
                    startIcon={<VisibilityOutlinedIcon />}
                    fullWidth
                    sx={{
                      borderColor: '#BCD2E2',
                      color: '#0B5A91',
                      textTransform: 'none',
                      fontWeight: 700,
                    }}
                  >
                    View
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<EditOutlinedIcon />}
                    fullWidth
                    onClick={() => handleEdit(announcement)}
                    sx={{
                      borderColor: '#BCD2E2',
                      color: '#0B5A91',
                      textTransform: 'none',
                      fontWeight: 700,
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    color="error"
                    onClick={() => handleDelete(announcement.id)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                    }}
                  >
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
        )}
        <Dialog
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ color: '#173F60', fontWeight: 800 }}>
            {editingId !== null ? 'Edit Announcement' : 'Create Announcement'}
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                label="Title"
                fullWidth
                value={form.title}
                onChange={(e) => updateForm('title', e.target.value)}
              />

              <TextField
                label="Audience"
                fullWidth
                value={form.audience}
                onChange={(e) => updateForm('audience', e.target.value)}
              />

              <TextField
                select
                label="Type"
                fullWidth
                value={form.type}
                onChange={(e) => updateForm('type', e.target.value)}
              >
                <MenuItem value="TRAINING">Training</MenuItem>
                <MenuItem value="ASSESSMENT">Assessment</MenuItem>
                <MenuItem value="NOTICE">Notice</MenuItem>
                <MenuItem value="SYSTEM">System</MenuItem>
              </TextField>

              <TextField
                select
                label="Status"
                fullWidth
                value={form.status}
                onChange={(e) => updateForm('status', e.target.value)}
              >
                <MenuItem value="DRAFT">Draft</MenuItem>
                <MenuItem value="PUBLISHED">Published</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => {
              setOpenCreate(false);
              setEditingId(null);
            }}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={!form.title.trim()}
              sx={{
                bgcolor: '#0B5A91',
                textTransform: 'none',
                fontWeight: 700,
              }}
            >
              {editingId !== null ? 'Save Changes' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </Box>
  );
};

export default Announcements;
