import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tab,
  Tabs
} from '@mui/material';
import BillCalculator from '../components/BillCalculator';
import BillList from '../components/BillList';
import PaymentModal from '../components/PaymentModal';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { paymentOrder } = useSelector((state) => state.bills);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Open payment modal when payment order is created
  React.useEffect(() => {
    if (paymentOrder) {
      setIsPaymentModalOpen(true);
    }
  }, [paymentOrder]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h1" variant="h4" gutterBottom>
              Welcome, {user.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Consumer Number: {user.consumerNumber}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Meter Number: {user.meterNumber}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="dashboard tabs"
                centered
              >
                <Tab label="Calculate Bill" />
                <Tab label="View Bills" />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              <BillCalculator />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <BillList />
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
      <PaymentModal
        open={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </Container>
  );
};

export default Dashboard;
