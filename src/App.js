import React, { useEffect, useState } from "react";
import {
	FormControl,
	Select,
	MenuItem,
	Card,
	CardContent,
} from "@material-ui/core";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import "./App.css";

function App() {
	const [countries, setcountries] = useState([]);
	const [country, setcountry] = useState("Worldwide");
	const [countryInfo, setcountryInfo] = useState({});

	useEffect(() => {
		// code runs once inside the this effect when the components loads
		const getcountries = async () => {
			let data = await fetch("https://disease.sh/v3/covid-19/countries");
			let jsondata = await data.json();
			const countriess = await jsondata.map((country) => ({
				name: country.country,
				value: country.countryInfo.iso2,
			}));

			setcountries(countriess);
		};

		getcountries();
	}, []);

	useEffect(async () => {
		const url = "https://disease.sh/v3/covid-19/all";

		const rawdata = await fetch(url);
		const data = await rawdata.json();
		setcountryInfo(data);
	}, []);

	const onChangecountry = async (e) => {
		const countryCode = e.target.value;
		const url =
			countryCode === "Worldwide"
				? "https://disease.sh/v3/covid-19/all"
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		const rawdata = await fetch(url);
		const data = await rawdata.json();

		setcountry(countryCode);
		setcountryInfo(data);
		console.log(data);
	};

	return (
		<div className="app">
			<div className="app_left">
				<div className="app_header">
					<h1>{"Covid19 Tracker"}</h1>
					<FormControl className="app_dropdown">
						<Select
							variant="outlined"
							value={country}
							onChange={onChangecountry}
						>
							<MenuItem value={"Worldwide"}>WorldWide</MenuItem>
							{/* loop through all the countries and sho the dropdown */}
							{countries.map((country) => {
								return (
									<MenuItem key={country?.value} value={country?.value}>
										{country?.name}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</div>

				<div className="app_states">
					{/* InforBox with props title={coronacases} */}
					<InfoBox
						key="1"
						title={"Coronavirus Cases"}
						cases={countryInfo.todayCases}
						total={countryInfo.cases}
					/>
					<InfoBox
						key="2"
						title={"Recovered"}
						cases={countryInfo.todayRecovered}
						total={countryInfo.recovered}
					/>
					<InfoBox
						key="3"
						title={"Deaths"}
						cases={countryInfo.todayDeaths}
						total={countryInfo.deaths}
					/>
				</div>

				{/* map */}
				<Map />
			</div>
			<Card className="app_right">
				<CardContent>
					{/* Table */}
					<h3>{"Live casses by country"}</h3>
					{/* Graph */}
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
