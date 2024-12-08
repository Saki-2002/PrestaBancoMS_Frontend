import React, { useEffect } from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import MCSimulationService from '../services/MCSimulationService';
import MCTypesService from '../services/MCTypesService';

import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


const MCSimulation = () => {
  const [loanAmount, setLoanAmonut] = useState("");
  const [annualInterestRate, setAnnualInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [mcTypes, setMCTypes] = useState([]);
  const [selectedMCType, setSelectedMCType] = useState("");
  const [simulationResult, setSimulationResult] = useState(null);

  const [annualInterestRateLimits, setAnnualInterestRateLimits] = useState({min:0,max:0});
  const [loanTermLimit, setLoanTermLimit] = useState(0);

  useEffect(() => {
    const getMCTypes = async () => {
      try {
        const response = await MCTypesService.getAll();
        setMCTypes(response.data);
      } catch (error){
        console.log("Error al cargar los tipos", error);  
      }
    };

    getMCTypes();
  },[]);


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

  const simulateMC = (e) => {
    e.preventDefault();

    const mcSimulation = {
      loanAmount:parseInt(loanAmount),
      annualInterestRate: parseFloat(annualInterestRate),
      loanTerm:parseInt(loanTerm)
    };

    MCSimulationService
      .simulate(mcSimulation)
      .then((response) => {
        setSimulationResult(response.data);
        console.log("Simulacion exitosa",response.data);
      })
      .catch ((error) => {
        console.log("Error al simular", error);
      });
  }

    // Validaciones para los campos
    const isLoanAmountValid = loanAmount >= 0 && loanAmount!=0;
    const isAnnualInterestRateValid = annualInterestRate >= annualInterestRateLimits.min && annualInterestRate <= annualInterestRateLimits.max && annualInterestRate!=0;
    const isLoanTermValid = loanTerm >= 0 && loanTerm <= loanTermLimit && loanTerm!= 0;
  
    // Determinar si el botón debe estar habilitado
    const isButtonDisabled = !(isLoanAmountValid && isAnnualInterestRateValid && isLoanTermValid);

  return (
    <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        component="form"
      >
        <h3> Simular Crédito Bancario Chile</h3>
        <hr />
        
          <FormControl fullWidth>
            <InputLabel id="mctypes-lists">Tipo de Crédito Hipotecario</InputLabel>
            <Select
              labelId='mctypes-lists'
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
              label="Monto del préstamo"
              variant='outlined'
              type="number"
              size="small"
              value={loanAmount}
              onChange={(e) => setLoanAmonut(e.target.value)}
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
            color="info"
            onClick={(e) => simulateMC(e)}
            style={{ marginLeft: "0.5rem" }}
            startIcon={<MonetizationOnIcon />}
            disabled={isButtonDisabled}
          >
            Simular Crédito
          </Button>
        </FormControl>

        {simulationResult &&(
          <Card variant="outlined" style={{ padding: '16px' }}>
          <CardContent>
              <Typography variant="body1">
                <strong>Cuota Mensual:</strong> {simulationResult} <strong>CLP</strong>
              </Typography>
          </CardContent>
        </Card>
        )}
        



      </Box>
      
  );
};
export default MCSimulation;