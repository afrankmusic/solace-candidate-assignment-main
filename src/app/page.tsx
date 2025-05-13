"use client";

import { useEffect, useState, ChangeEventHandler } from "react";
import { Advocate } from "./types";
import { useDebounce } from "./utils";
import {
  Box,
  Button,
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Stack,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";

type AdvocateTableProps = {
  data: Advocate[];
};

const AdvocateTable = ({ data }: AdvocateTableProps): JSX.Element => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Degree</TableCell>
            <TableCell>Specialties</TableCell>
            <TableCell>Years of Experience</TableCell>
            <TableCell>Phone Number</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((advocate) => (
            <TableRow
              key={advocate.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {advocate.firstName}
              </TableCell>
              <TableCell>{advocate.lastName}</TableCell>
              <TableCell>{advocate.city}</TableCell>
              <TableCell>{advocate.degree}</TableCell>
              <TableCell>
                {advocate.specialties.map((s) => (
                  <Box key={s}>{s}</Box>
                ))}
              </TableCell>
              <TableCell>{advocate.yearsOfExperience}</TableCell>
              <TableCell>{advocate.phoneNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalAdvocates, setTotalAdvocates] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = () => {
    console.log("fetching advocates...");
    fetch(`/api/advocates?search=${searchTerm || ""}`).then((response) => {
      response.json().then((jsonResponse) => {
        setTotalAdvocates(jsonResponse.total);
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
        setIsLoading(false);
      });
    });
  };

  const debouncedFetchData = useDebounce(fetchData, 1000);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    debouncedFetchData();
  }, [searchTerm]);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
  };

  const onClick = () => {
    setSearchTerm("");
  };

  return (
    <Box sx={{ margin: 4 }}>
      <Stack direction="column" spacing={4}>
        <Typography variant="h1">Solace Advocates</Typography>
        <Box>
          <Typography variant="h2">Search Advocates</Typography>
          <Stack direction="row">
            <TextField
              id="outlined-search"
              label="Search"
              value={searchTerm}
              onChange={onChange}
            />
            <Button onClick={onClick}>Reset Search</Button>
            {/**
             * Note: this isn't the most beautiful spinner placement in the world, with more time
             */}
            {isLoading && <CircularProgress color="inherit" />}
          </Stack>
        </Box>
        <Typography>
          Displaying {filteredAdvocates.length} advocates of {totalAdvocates}
        </Typography>
        <AdvocateTable data={filteredAdvocates} />
      </Stack>
    </Box>
  );
}
