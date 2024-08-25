import {useState, useEffect} from 'react'
import axios from 'axios'

const App = () => {
    const [countries, setCountries] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCountry, setSelectedCountry] = useState(null)

    
    useEffect( ()=> {
        axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
        .then(response => {
            setCountries(response.data)
        }
        )
    }, [])



    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value)
        setSelectedCountry(false)
    }

    if (!countries) {
      return <div>Loading...</div>   
    }
    

    let countryList = searchTerm ? countries.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase()))
        : null 
    if (countryList && countryList.length === 0) { // in case  there are no matches with the search term 
        countryList = null
    }
    
    const handleSelection = (commonName) => {
        
        setSelectedCountry(countryList.filter(country => 
            country.name.common === commonName)[0]) 

        
    }
    
 
    return (
        <div>
            <form >
                <div htmlFor="search" >find countries </div>
                <input type="text" onChange={handleSearchTermChange} value={searchTerm} autoFocus/>
            </form>
            <Country countryList = {countryList} handleSelection={handleSelection} selectedCountry={selectedCountry}/>
        </div>
    )



}

const Country = (props) => {

    if (!props.countryList) {return null}

    const {countryList, handleSelection, selectedCountry} = props

    if (selectedCountry) {
        return < CountryData country={selectedCountry} />
    }

    if (countryList.length > 10 ){
        return <div>too many matches, specify another filter</div>
    } else if (countryList.length > 1 ) {
        return (
           <ul>
             {countryList.map(country => 
                <div key={country.name.common}  >
                <li >{country.name.common}</li>
                <button onClick={() => handleSelection(country.name.common)}>show</button>
                </div>
             )}
           </ul>
        )
    }

    return (
        
        
        <CountryData country={countryList[0]} />
        
    )
}

const CountryData = ({country})  => {

   
    
    const languageList = []
   

    for (const key in country.languages) {
        languageList.push(country.languages[key])
    }
    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>capital {country.capital}</p>
            <p>area {country.area}</p>
            <h3>languages</h3>
            <ul>
                {languageList.map (language => 
                    <li key={language}>{language}</li>
                )}
                
            </ul>
            <img src={country.flags.png} alt={`flag of ${country.name.common}`} />
            <CapitalWeather capital = {country.capital} code = {country.cioc}/>
            
        </div>
    )
    
}

const CapitalWeather = ({capital, code}) => {

    const [capitalWeather, setCapitalWeather ] = useState(null)
    


    const api_key = import.meta.env.VITE_SOME_KEY


    useEffect(()=> {
        axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${capital},${code}&limit=${1}&appid=${api_key}`).then( response => {
            axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${response.data[0].lat}&lon=${response.data[0].lon}&appid=${api_key}&units=metric`).then(response => {
                    setCapitalWeather(response.data)
                    
                    
                }
                    
                    
                )
        }   
        )
    }, [])

    if (!capitalWeather) {
        return <div>loading weather data.....</div>
    }

    return (
        <div>
            <h1>Weather in {capital}</h1>
            <p>temperature {capitalWeather.main.temp} Celsius</p>
            <img src={`https://openweathermap.org/img/wn/${capitalWeather.weather[0].icon}@2x.png`} alt={capitalWeather.weather[0].description}/>
            <p>wind {capitalWeather.wind.speed}m/s</p>
        </div>
    )

}

export default App