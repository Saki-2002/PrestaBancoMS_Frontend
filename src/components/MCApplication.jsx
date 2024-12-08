import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MCTypesService from '../services/MCTypesService';
import MCApplicationService from '../services/MCApplicationService';

import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const MCApplication = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [mcTypes, setMCTypes] = useState([]);
  const [selectedMCType, setSelectedMCType] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [applicationCreated, setApplicationCreated] = useState(false);
  const [annualInterestRateLimits, setAnnualInterestRateLimits] = useState({ min: 0, max: 0 });
  const [annualInterestRate, setAnnualInterestRate] = useState("");
  const [loanTermLimit, setLoanTermLimit] = useState(0);
  const [loanTerm, setLoanTerm] = useState("");
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    const getMCTypes = async () => {
      try {
        const response = await MCTypesService.getAll();
        setMCTypes(response.data);
      } catch (error) {
        console.log("Error al cargar los tipos", error);
      }
    };

    getMCTypes();
  }, []);


  const handleTypeChange = (event) => {
    const selectedTypeId = event.target.value;
    setSelectedMCType(selectedTypeId);

    const selectedMCType = mcTypes.find(type => type.id === selectedTypeId);
    if(selectedMCType){
      setAnnualInterestRateLimits({
        min:selectedMCType.min_interest_rate,
        max:selectedMCType.max_interest_rate,
      });
      setLoanTermLimit(selectedMCType.max_term);    
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedType = mcTypes.find(type => type.id === selectedMCType);

    const applicationData = {
      status: 1, //Pendiente de envio
      type: selectedMCType,
      client: auth.user.id,
      //executive: null,
      loanAmount: parseInt(loanAmount),
      loanTerm: loanTerm,
      annualInterestRate: annualInterestRate,
      lienInsurance: 3, // 3% del monto del préstamo por mes
      fireInsurance: 20000, // 20.000 CLP por mes
      administrationCommission: 1 // 1% del monto total del préstamo
    };

    try {
      const response = await MCApplicationService.create(applicationData);
      console.log("Solicitud exitosa", response.data);
      setApplicationCreated(true);
      setSnackbarMessage("Solicitud exitosa");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate('/tracking');
      }, 3000);
    } catch (error) {
      console.log("Error al realizar la solicitud", error);
      setSnackbarMessage("Error al realizar la solicitud");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      component="form"
      onSubmit={handleSubmit}
    >
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <h3>Realizar Solicitud de Crédito Hipotecario</h3>
      <hr />
      <FormControl fullWidth>
        <InputLabel id="mctypes-list">Tipo de Crédito Hipotecario</InputLabel>
        <Select
          labelId='mctypes-list'
          value={selectedMCType}
          onChange={handleTypeChange}
          displayEmpty
        >
          {mcTypes.map(mctype => (
            <MenuItem key={mctype.id} value={mctype.id}>
              {mctype.type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <br />
      <FormControl fullWidth>
        <TextField
          id="loan-amount"
          label="Monto del Préstamo"
          variant='outlined'
          type="number"
          size="small"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />
        <Typography variant="caption" color="textSecondary">
          En CLP.
        </Typography>
      </FormControl>
      <br />
      <FormControl fullWidth>
        <TextField
          id="annual-interest-rate"
          label="Interés Anual"
          variant='outlined'
          type="number"
          size="small"
          value={annualInterestRate}
          onChange={(e) => setAnnualInterestRate(e.target.value)}
          inputProps={{
            min:annualInterestRateLimits.min,
            max:annualInterestRateLimits.max
          }}
        />
        {selectedMCType && (
        <Typography variant="caption" color="textSecondary">
          Indique un valor entre {annualInterestRateLimits.min}% y {annualInterestRateLimits.max}%.
        </Typography>
        )}
      </FormControl>
      <br />
      <FormControl fullWidth>
        <TextField
          id="loan-term"
          label="Plazo en Años"
          variant='outlined'
          type="number"
          size="small"
          value={loanTerm}
          onChange={(e) => setLoanTerm(e.target.value)}
          inputProps={{
            max: loanTermLimit
          }}
        />
        {selectedMCType && (
          <Typography variant="caption" color ="textSecondary">
            Indique un valor entre 1 y {loanTermLimit} Años.
          </Typography>
        )}
      </FormControl>
      <br />
      <FormControl>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={!auth.isAuthenticated}
        >
          Realizar Solicitud
        </Button>
      </FormControl>

      {applicationCreated && (
        <Card variant="outlined" style={{ padding: '16px', marginTop: '16px' }}>
          <CardContent>
            <Typography variant="body1">
              <strong>Solicitud creada con éxito.</strong> Redirigiendo al seguimiento de aplicaciones...
            </Typography>
          </CardContent>
        </Card>
      )}

    </Box>
  );
};

export default MCApplication;