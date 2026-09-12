import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useNavigate } from 'react-router-dom';
import { apiFetch, apiFetchBlob } from '../../../services/api';
import AiChatbot from '../../../components/AiChatbot';

type Resource = {
  id: number;
  title: string;
  description?: string;
  department?: string;
  type: 'FILE' | 'LINK';
  url?: string;
  originalFileName?: string;
  contentType?: string;
  createdAt: string;
};

const getIcon = (resource: Resource) => {
  if (resource.type === 'LINK') return <LinkOutlinedIcon />;
  if (resource.contentType?.includes('pdf')) {
    return <PictureAsPdfOutlinedIcon />;
  }
  return <DescriptionOutlinedIcon />;
};

const TrainerLibrary = () => {
  const navigate = useNavigate();

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('my');
  const [department, setDepartment] = useState('all');
  const [type, setType] = useState('all');
  const [addDepartment, setAddDepartment] = useState('');

  const [addOpen, setAddOpen] = useState(false);
  const [addType, setAddType] = useState<'FILE' | 'LINK'>('FILE');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerTitle, setViewerTitle] = useState('');
  const [viewerUrl, setViewerUrl] = useState('');
  const [viewerType, setViewerType] = useState<'file' | 'link'>('file');
  const [aiResourceId, setAiResourceId] = useState<number | null>(null);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/trainee/resources');
      setResources(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const departments = useMemo(
    () =>
      Array.from(
        new Set(
          resources
            .map((r) => r.department)
            .filter(Boolean)
        )
      ),
    [resources]
  );

  const filteredResources = useMemo(() => {
    const q = search.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesSearch =
        !q ||
        resource.title.toLowerCase().includes(q) ||
        resource.description?.toLowerCase().includes(q) ||
        resource.originalFileName?.toLowerCase().includes(q);

      const matchesDepartment =
        department === 'all' || resource.department === department;

      const matchesType =
        type === 'all' || resource.type === type;

      return matchesSearch && matchesDepartment && matchesType;
    });
  }, [resources, search, department, type]);

  const resetDialog = () => {
    setAddOpen(false);
    setAddType('FILE');
    setTitle('');
    setDescription('');
    setLink('');
    setFile(null);
    setAddDepartment('');
  };

  const addResource = async () => {
    if (!title.trim()) return;

    try {
      setSaving(true);

      if (addType === 'FILE') {
        if (!file) return;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('department', addDepartment.trim());
        formData.append('file', file);

        await apiFetch('/trainee/resources/file', {
          method: 'POST',
          body: formData,
        });
      } else {
        await apiFetch('/trainee/resources/link', {
          method: 'POST',
          body: JSON.stringify({
            title,
            description,
            department: addDepartment.trim(),
            url: link,
          }),
        });
      }

      resetDialog();
      await loadResources();
    } catch (error) {
      console.error(error);
      alert('Could not add resource.');
    } finally {
      setSaving(false);
    }
  };

  const openResource = async (resource: Resource) => {
    try {
      if (resource.type === 'LINK' && resource.url) {
        setViewerTitle(resource.title);
        setViewerUrl(resource.url);
        setViewerType('link');
        setViewerOpen(true);
        return;
      }

      const blob = await apiFetchBlob(`/trainee/resources/${resource.id}/file`);
      const url = URL.createObjectURL(blob);

      setViewerTitle(resource.title);
      setViewerUrl(url);
      setViewerType('file');
      setViewerOpen(true);
    } catch (error) {
      console.error(error);
      alert('Could not open resource.');
    }
  };

  const closeViewer = () => {
    if (viewerType === 'file' && viewerUrl) {
      URL.revokeObjectURL(viewerUrl);
    }
    setViewerOpen(false);
    setViewerUrl('');
    setViewerTitle('');
  };

  const deleteResource = async (id: number) => {
    if (!window.confirm('Delete this resource?')) return;

    try {
      await apiFetch(`/trainee/resources/${id}`, {
        method: 'DELETE',
      });

      setResources((current) => current.filter((r) => r.id !== id));
    } catch (error) {
      console.error(error);
      alert('Could not delete resource.');
    }
  };

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            mb: 4,
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                color: '#173F60',
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              My Resources
            </Typography>

            <Typography sx={{ color: '#657887', mt: 1, lineHeight: 1.7 }}>
              Manage your personal study materials, documents and useful links.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={() => setAddOpen(true)}
            sx={{
              bgcolor: '#075B91',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              '&:hover': { bgcolor: '#064D7B' },
            }}
          >
            Add Resource
          </Button>
        </Stack>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <TextField
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon sx={{ color: '#718594' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            select
            label="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            sx={{ width: { xs: '100%', md: 190 } }}
          >
            <MenuItem value="my">My Resources</MenuItem>
            <MenuItem value="all">All Resources</MenuItem>
          </TextField>

          <TextField
            select
            label="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            sx={{ width: { xs: '100%', md: 210 } }}
          >
            <MenuItem value="all">All departments</MenuItem>
            {departments.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Resource type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            sx={{ width: { xs: '100%', md: 190 } }}
          >
            <MenuItem value="all">All resources</MenuItem>
            <MenuItem value="FILE">Files</MenuItem>
            <MenuItem value="LINK">External links</MenuItem>
          </TextField>
        </Stack>

        <Typography sx={{ color: '#536A7B', mb: 2.5, fontWeight: 600 }}>
          {filteredResources.length} resources
        </Typography>

        {loading ? (
          <Typography sx={{ color: '#657887' }}>
            Loading resources...
          </Typography>
        ) : filteredResources.length === 0 ? (
          <Box
            sx={{
              bgcolor: '#FFFFFF',
              border: '1px solid #DCE8F0',
              borderRadius: 2,
              p: 6,
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{ color: '#173F60', fontWeight: 700, fontSize: '1.1rem' }}
            >
              No resources found
            </Typography>
            <Typography sx={{ color: '#718594', mt: 1 }}>
              Add a document, study material or external link to get started.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: { xs: 2, md: 2.5 },
            }}
          >
            {filteredResources.map((resource) => (
              <Box
                key={resource.id}
                sx={{
                  bgcolor: '#FFFFFF',
                  border: '1px solid #DCE8F0',
                  borderRadius: 2,
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 280,
                }}
              >
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: 1.5,
                      bgcolor: '#EAF4FB',
                      color: '#0B6497',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getIcon(resource)}
                  </Box>

                  <Chip
                    label={resource.department || 'General'}
                    size="small"
                    sx={{
                      bgcolor: '#EAF4FB',
                      color: '#0B5A91',
                      fontWeight: 600,
                    }}
                  />
                </Stack>

                <Typography
                  sx={{
                    color: '#173F60',
                    fontWeight: 700,
                    fontSize: '1.08rem',
                    mt: 2.5,
                    lineHeight: 1.4,
                  }}
                >
                  {resource.title}
                </Typography>

                <Typography
                  sx={{
                    color: '#657887',
                    mt: 1,
                    fontSize: '0.9rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {resource.description ||
                    resource.originalFileName ||
                    resource.url ||
                    'Learning resource'}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    mt: 1.5,
                    color: '#718594',
                    alignItems: 'center',
                  }}
                >
                  <DescriptionOutlinedIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2">
                    {resource.type === 'LINK'
                      ? 'External link'
                      : resource.originalFileName || 'Uploaded file'}
                  </Typography>
                </Stack>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1}
                  sx={{ mt: 'auto', pt: 2.5 }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<OpenInNewOutlinedIcon />}
                    onClick={() => openResource(resource)}
                    sx={{
                      borderColor: '#B8D0E0',
                      color: '#075B91',
                      fontWeight: 600,
                      textTransform: 'none',
                    }}
                  >
                    Open
                  </Button>

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AutoAwesomeOutlinedIcon />}
                    onClick={() =>
                      navigate(`/trainee/ai?resourceId=${resource.id}`)
                    }
                    sx={{
                      bgcolor: '#075B91',
                      fontWeight: 600,
                      textTransform: 'none',
                    }}
                  >
                    Ask AI
                  </Button>

                  <Button
                    sx={{ minWidth: 44, color: '#B54747' }}
                    onClick={() => deleteResource(resource.id)}
                  >
                    <DeleteOutlineOutlinedIcon />
                  </Button>
                </Stack>
              </Box>
            ))}
          </Box>
        )}

        {aiResourceId !== null && (
          <Box
            id="resource-ai-chat"
            sx={{
              mt: 4,
              bgcolor: '#FFFFFF',
              border: '1px solid #DCE8F0',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                px: 2.5,
                py: 1.5,
                borderBottom: '1px solid #DCE8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography sx={{ color: '#173F60', fontWeight: 700 }}>
                Ask AI about this resource
              </Typography>

              <Button
                size="small"
                onClick={() => setAiResourceId(null)}
                sx={{ textTransform: 'none' }}
              >
                Close
              </Button>
            </Box>

            <Box sx={{ height: 520 }}>
              <AiChatbot resourceId={aiResourceId} />
            </Box>
          </Box>
        )}
      </Container>

      <Dialog
        open={viewerOpen}
        onClose={closeViewer}
        fullWidth
        maxWidth="xl"
        slotProps={{
          paper: {
            sx: {
              height: '88vh',
              maxHeight: '88vh',
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            color: '#173F60',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {viewerTitle}
          <Button
            onClick={closeViewer}
            startIcon={<CloseOutlinedIcon />}
            sx={{ textTransform: 'none' }}
          >
            Close
          </Button>
        </DialogTitle>

        <DialogContent sx={{ p: 0, bgcolor: '#F5F8FA' }}>
          <Box
            component="iframe"
            src={viewerUrl}
            title={viewerTitle}
            sx={{
              width: '100%',
              height: '100%',
              border: 0,
              bgcolor: '#fff',
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={addOpen}
        onClose={saving ? undefined : resetDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ color: '#173F60', fontWeight: 700 }}>
          Add Resource
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2.2} sx={{ pt: 1 }}>
            <TextField
              select
              label="Resource type"
              value={addType}
              onChange={(e) =>
                setAddType(e.target.value as 'FILE' | 'LINK')
              }
              fullWidth
            >
              <MenuItem value="FILE">File</MenuItem>
              <MenuItem value="LINK">External Link</MenuItem>
            </TextField>

            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />

            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              minRows={3}
              fullWidth
            />

            {addType === 'FILE' ? (
              <Button
                component="label"
                variant="outlined"
                sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
              >
                {file ? file.name : 'Choose file'}
                <input
                  hidden
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.md,.csv,.png,.jpg,.jpeg,.webp"
                  onChange={(e) =>
                    setFile(e.target.files?.[0] || null)
                  }
                />
              </Button>
            ) : (
              <TextField
                label="External URL"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                fullWidth
              />
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={resetDialog}
            disabled={saving}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={addResource}
            disabled={
              saving ||
              !title.trim() ||
              (addType === 'FILE' ? !file : !link.trim())
            }
            sx={{
              bgcolor: '#075B91',
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            {saving ? 'Adding...' : 'Add Resource'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainerLibrary;
