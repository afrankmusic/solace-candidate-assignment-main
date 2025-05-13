"use client";

import { useEffect, useState, ChangeEventHandler } from "react";
import { Advocate } from "./types";
import { useDebounce } from "./utils";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalAdvocates, setTotalAdvocates] = useState<number>();

  const fetchData = () => {
    console.log("fetching advocates...");
    fetch(`/api/advocates?search=${searchTerm || ""}`).then((response) => {
      response.json().then((jsonResponse) => {
        console.log(jsonResponse);
        setTotalAdvocates(jsonResponse.total);
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  };

  const debouncedFetchData = useDebounce(fetchData, 500);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
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
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term">{searchTerm}</span>
        </p>
        <p>
          Displaying {filteredAdvocates.length} advocates of {totalAdvocates}
        </p>
        <input
          style={{ border: "1px solid black" }}
          onChange={onChange}
          value={searchTerm}
        />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr key={advocate.id}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div key={s}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
