import { useState, useEffect } from 'react'
import axios from 'axios'
import banner from './banner.png'

const key = process.env.REACT_APP_OMDB_API_KEY

function App() {
  const [movieTitle, setMovieTitle] = useState('')
  const [currentTitle, setcurrentTitle] = useState('')
  const [searchExecuted, setSearchExecuted] = useState(0)
  const [movieInfo, setMovieInfo] = useState([])
  const [movies, setMovies] = useState([])
  const [allMovieData, setAllMovieData] = useState([])
  const dataArray = []
  const movieInfoArray = []
  
  const movieTitleSearch = (e) => {
    e.preventDefault()
    setcurrentTitle(movieTitle)
    setSearchExecuted(1)
    
    axios.get(`https://www.omdbapi.com/?s=${movieTitle}&apikey=${key}`).then(res => {
      res.data.Search.forEach(data => data.Poster !== "N/A" ? dataArray.push([data.Title, data.Year, data.Poster]) : null)

      dataArray.forEach(title => {
        axios.get(`https://www.omdbapi.com/?t=${title[0]}&apikey=${key}`).then(res => {
          movieInfoArray.push([res.data.Actors, res.data.Type, res.data.Plot, res.data.Rated, res.data.Genre, res.data.Director, res.data.Runtime, res.data.Metascore, res.data.imdbRating])
        })
      })

      while (dataArray.length > 9) {
        dataArray.pop()
      }

      while (movieInfoArray.length > 9) {
        movieInfoArray.pop()
      }

      setMovies(dataArray)
      setMovieInfo(movieInfoArray)

      const allData = movies.map((movie, index) => {
        return movie.concat(movieInfo[index])
      })
      
      setAllMovieData(allData)
    }).catch(error => {
        console.log(error)
        setMovies([])
    })
  }

  // useEffect(() => {
  //   const allData = movies.map((movie, index) => {
  //     return movie.concat(movieInfo[index])
  //   })
  //    setAllMovieData(allData)
  // }, [movies, movieInfo])
    
  //   setAllMovieData(allData, () => console.log(allMovieData))
  // }, [])

  
  
  // const getMovieInfo = (e) => {
  //   e.preventDefault()
  //   const searchTitle = e.currentTarget.nextElementSibling.textContent
  //   const searchArr = searchTitle.split('')

  //   for (let i = 0; i < 7; i++) {
  //     searchArr.pop()
  //   }

  //   axios.get(`https://www.omdbapi.com/?t=${searchArr.join('')}&apikey=15dfe4ee`).then(res => {
  //     // console.log(res.data.Title)
  //     movieInfoArray.push([res.data.Awards, res.data.Actors, res.data.Type, res.data.Plot, res.data.Rated, res.data.Genre, res.data.Director, res.data.Runtime, res.data.Metascore, res.data.imdbRating])
  //   })

  //   setMovieInfo(movieInfoArray)
  //   // console.log(movieInfo[0])
  //   // setAllMovieData([movies, movieInfo])
  //   // console.log(collectiveDataArray)
  //   // collectiveDataArray.map(movie => console.log(movie[0]))
  // }


  // const redirect = (e) => {
  //   e.preventDefault()
  //   const searchTitle = e.target.textContent
  //   const searchArr = searchTitle.split('')

  //   for (let i = 0; i < 7; i++) {
  //     searchArr.pop()
  //   }

  //   axios.get(`https://www.omdbapi.com/?t=${searchArr.join('')}&apikey=15dfe4ee`).then(res => {
  //     console.log(res)
  //   })
  //   console.log(searchArr.join(''))
  // }

  return (
    <div className="App">
      <div className='bannerContainer'>
        <img className='banner' src={banner} alt="" />
        <p className='bannerText'>Movie Library</p>
      </div>
      <br />
      <div className='inputContainer'>
        <form 
          action="" 
          onChange={() => setMovieTitle(document.getElementById('input').value)}
          onSubmit={movieTitleSearch}>
          <input 
            type="text" 
            id='input'
            placeholder='Movie Search'
            className='input'
          />
        </form>
        <br />
        <div>
          {searchExecuted === 1 
            ? (
                <h2 className='search'>
                  {movies.length > 0 
                    ? (
                        <p> 
                          Showing search results for '{currentTitle.split('').map((char, index) => index === 0 
                            ? char.toUpperCase() 
                            : char)}' 
                        </p>
                      )
                    : (
                        <p> 
                          No results to display for '{currentTitle.split('').map((char, index) => index === 0 
                            ? char.toUpperCase() 
                            : char)}' 
                        </p>
                      )
                    }
                </h2>
              )
            : (<h2> </h2>)
          }
        </div>
      </div>
      <div className='titleContainer'>
        {allMovieData.map(movie => (
            <div className='movieDescriptionContainer'>
            <img className='poster' src={movie[2]} alt="" /> 
            <div className='movieDescription'>
              <h4>{movie[4].split('').map((char, index) => index === 0 ? char.toUpperCase() : char)} ({movie[6]}) - {movie[7]}</h4>
              {/* <p>{movie[3]}</p> */}
              <p>"{movie[5]}"</p>
              <p>Main actors: {movie[3]}</p>
              <p>{movie[8].includes(',') ? 'Directors' : 'Director'}: {movie[8]}</p>
              <p>Runtime: {movie[9]}</p>
              <p>Metascore: {movie[10]}</p>
              <p>IMDb Rating: {movie[11]}</p>
            </div> 
            <p className='movieName'>{movie[0]} ({movie[1]})</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
