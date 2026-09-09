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
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {
  getPendingTrainerApplications,
  getUsers,
  reviewTrainerApplication,
  getTrainerApplicationDocument,
} from '../../../services/api';

interface Application {
  id: number;
  userId: number;
  reason?: string;
  supportingDocumentUrl?: string;
  supportingDocumentKey?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminComment?: string;
  submittedAt: string;
  reviewedAt?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  department?: string;
}

const TrainerApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<Application | null>(null);
  const [reviewStatus, setReviewStatus] = useState<'APPROVED' | 'REJECTED' | null>(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [applicationData, userData] = await Promise.all([
        getPendingTrainerApplications(),
        getUsers(),
      ]);
      setApplications(applicationData);
      setUsers(userData);
      setError('');
    } catch {
      setError('Unable to load trainer applications from the backend.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const userMap = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    [users]
  );

  const getApplicant = (userId: number) => userMap.get(userId);

  const openReview = (
    application: Application,
    status: 'APPROVED' | 'REJECTED'
  ) => {
    setSelected(application);
    setReviewStatus(status);
    setComment('');
  };

  const closeReview = () => {
    setSelected(null);
    setReviewStatus(null);
    setComment('');
  };

  const submitReview = async () => {
    if (!selected || !reviewStatus) return;

    setLoading(true);
    setError('');

    try {
      await reviewTrainerApplication(selected.id, reviewStatus, comment);
      closeReview();
      await loadData();
    } catch {
      setError(`Unable to ${reviewStatus === 'APPROVED' ? 'approve' : 'reject'} the application.`);
    } finally {
      setLoading(false);
    }
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
            Trainer Applications
          </Typography>

          <Typography sx={{ color: '#657887', mt: 1 }}>
            Review and approve trainee requests for trainer access.
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

        <Card
          elevation={0}
          sx={{
            border: '1px solid #DCE8F0',
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack
              direction="row"
              sx={{
                mb: 3,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography sx={{ color: '#173F60', fontWeight: 800, fontSize: '1.25rem' }}>
                  Pending Applications
                </Typography>
                <Typography sx={{ color: '#657887', mt: 0.5 }}>
                  {applications.length} application{applications.length === 1 ? '' : 's'} awaiting review
                </Typography>
              </Box>

              <Chip
                label={`${applications.length} Pending`}
                sx={{
                  bgcolor: '#FFF7E6',
                  color: '#9A6700',
                  fontWeight: 700,
                }}
              />
            </Stack>

            {applications.length === 0 ? (
              <Box
                sx={{
                  py: 7,
                  textAlign: 'center',
                  border: '1px dashed #C8D7E1',
                  borderRadius: 2,
                }}
              >
                <PersonOutlineOutlinedIcon
                  sx={{ fontSize: 42, color: '#8AA0AF', mb: 1 }}
                />
                <Typography sx={{ color: '#173F60', fontWeight: 700 }}>
                  No pending applications
                </Typography>
                <Typography sx={{ color: '#657887', mt: 0.5 }}>
                  New trainer applications will appear here.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: 900 }}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 2fr 1.3fr 1.3fr 2fr',
                      gap: 2,
                      px: 2,
                      py: 1.5,
                      bgcolor: '#F5F8FA',
                      borderRadius: 1.5,
                    }}
                  >
                    {['Applicant', 'Email', 'Department', 'Submitted', 'Action'].map(
                      (heading) => (
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
                      )
                    )}
                  </Box>

                  <Stack spacing={0}>
                    {applications.map((application) => {
                      const applicant = getApplicant(application.userId);

                      return (
                        <Box
                          key={application.id}
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 2fr 1.3fr 1.3fr 2fr',
                            gap: 2,
                            alignItems: 'center',
                            px: 2,
                            py: 2,
                            borderBottom: '1px solid #E8EEF2',
                          }}
                        >
                          <Box>
                            <Typography sx={{ color: '#173F60', fontWeight: 700 }}>
                              {applicant
                                ? `${applicant.firstName} ${applicant.lastName}`.trim()
                                : `User #${application.userId}`}
                            </Typography>
                            <Typography sx={{ color: '#657887', fontSize: '0.85rem' }}>
                              {applicant?.username || '—'}
                            </Typography>
                          </Box>

                          <Typography sx={{ color: '#445B6B' }}>
                            {applicant?.email || '—'}
                          </Typography>

                          <Typography sx={{ color: '#445B6B' }}>
                            {applicant?.department || 'Not provided'}
                          </Typography>

                          <Typography sx={{ color: '#445B6B' }}>
                            {new Date(application.submittedAt).toLocaleDateString()}
                          </Typography>

                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<VisibilityOutlinedIcon />}
                              onClick={() => setSelected(application)}
                            >
                              View
                            </Button>

                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<CheckCircleOutlineOutlinedIcon />}
                              onClick={() => openReview(application, 'APPROVED')}
                              sx={{ bgcolor: '#0B5A91' }}
                            >
                              Approve
                            </Button>

                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              startIcon={<CancelOutlinedIcon />}
                              onClick={() => openReview(application, 'REJECTED')}
                            >
                              Reject
                            </Button>
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        <Dialog
          open={Boolean(selected)}
          onClose={closeReview}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ color: '#173F60', fontWeight: 800 }}>
            {reviewStatus
              ? `${reviewStatus === 'APPROVED' ? 'Approve' : 'Reject'} Trainer Application`
              : 'Application Details'}
          </DialogTitle>

          <DialogContent>
            {selected && (
              <Stack spacing={2} sx={{ pt: 1 }}>
                <Box>
                  <Typography sx={{ color: '#657887', fontSize: '0.82rem' }}>
                    Applicant
                  </Typography>
                  <Typography sx={{ color: '#173F60', fontWeight: 700 }}>
                    {(() => {
                      const applicant = getApplicant(selected.userId);
                      return applicant
                        ? `${applicant.firstName} ${applicant.lastName}`.trim()
                        : `User #${selected.userId}`;
                    })()}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ color: '#657887', fontSize: '0.82rem' }}>
                    Reason
                  </Typography>
                  <Typography sx={{ color: '#445B6B', mt: 0.5 }}>
                    {selected.reason || 'No reason provided.'}
                  </Typography>
                </Box>

                {(selected.supportingDocumentUrl ||
                  selected.supportingDocumentKey) && (
                  <Box>
                    <Typography sx={{ color: '#657887', fontSize: '0.82rem' }}>
                      Supporting Documents
                    </Typography>

                    <Stack direction="row" spacing={1.5} sx={{ mt: 0.5 }}>
                      {selected.supportingDocumentUrl && (
                        <Button
                          href={
                            selected.supportingDocumentUrl.startsWith('http')
                              ? selected.supportingDocumentUrl
                              : `https://${selected.supportingDocumentUrl}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          sx={{ px: 0 }}
                        >
                          Open external link
                        </Button>
                      )}

                      {selected.supportingDocumentKey && (
                        <Button
                          onClick={async () => {
                            try {
                              const blob =
                                await getTrainerApplicationDocument(selected.id);
                              const url = URL.createObjectURL(blob);
                              window.open(url, '_blank', 'noopener,noreferrer');
                            } catch (error) {
                              console.error(
                                'Failed to open supporting document:',
                                error
                              );
                              setError(
                                'Unable to open the uploaded supporting document.'
                              );
                            }
                          }}
                          sx={{ px: 0 }}
                        >
                          View uploaded document
                        </Button>
                      )}
                    </Stack>
                  </Box>
                )}

                {reviewStatus && (
                  <>
                    <Divider />
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label="Admin Comment"
                      placeholder={
                        reviewStatus === 'APPROVED'
                          ? 'Optional approval comment'
                          : 'Reason for rejection'
                      }
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                    />
                  </>
                )}
              </Stack>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={closeReview} disabled={loading}>
              Cancel
            </Button>

            {reviewStatus && (
              <Button
                variant="contained"
                color={reviewStatus === 'APPROVED' ? 'primary' : 'error'}
                onClick={submitReview}
                disabled={loading}
              >
                {loading
                  ? 'Saving...'
                  : reviewStatus === 'APPROVED'
                    ? 'Confirm Approval'
                    : 'Confirm Rejection'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default TrainerApplications;
