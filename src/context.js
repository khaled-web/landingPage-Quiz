import axios from 'axios'
import React, { useState, useContext, useEffect } from 'react'

const table = {
  sports: 21,
  history: 23,
  politics: 24,
}

const API_ENDPOINT = 'https://opentdb.com/api.php?'
const tempUrl = 'https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple'
const url = ''

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  //useState
  const [waiting, setWaiting]=useState(true)
  const [loading, setLoading]=useState(false)
  const [questions, setQuestions]=useState([])
  const [index, setIndex]=useState(0)
  const [correct, setCorrect]=useState(0)
  const [error, setError]=useState(false)
  const [quiz, setQuiz]=useState({
    amount:10,
    category:'sports',
    difficulty:'easy'
  })
  const [isModelOpen, setIsModalOpen]=useState(false)

  //gettingData-axios
  const fetchingQuestions = async(url)=>{
    setLoading(true)
    setWaiting(false)
    const response = await axios(url).catch(err=>console.log(err))
    if(response){
      const data = response.data.results
      console.log(data)
      if(data.length>0){
        setQuestions(data)
        setLoading(false)
        setWaiting(false)
        setError(false)
      }else{
        setWaiting(true)
        setError(true)

      }
    }else{
      setWaiting(true)
    }
  }
  //nextQuestion-function
  const nextQuestion = ()=>{
    setIndex((oldIndex)=>{
      const index = oldIndex + 1
      if(index > questions.length - 1){
        openModel()
        return 0
      }
      else{
        return index
      }
    })
  }
  //checkAnswer
  const checkQuestion=(value)=>{
    if(value){
      setCorrect((oldState)=>oldState+1)
    }
    nextQuestion()
  }
  //openModel(QuestionResult)
  const openModel = ()=>{
    setIsModalOpen(true)
  }
  //closeModel(QuestionResult)
  const closeModel = ()=>{
    setWaiting(true)
    setCorrect(0)
    setIsModalOpen(false)
  }
  //useEffect 
  // useEffect(()=>{
  //   fetchingQuestions(tempUrl)
  // },[])
  //handleChange
  const handleChange = (e)=>{
    const name = e.target.name
    const value = e.target.value
    setQuiz({...quiz, [name]:value})

  }
  //handleSubmit
  const handleSubmit = (e)=>{
  e.preventDefault()
  const{amount, category, difficulty}=quiz
  // const tempUrl = 'https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple'
  const url = `${API_ENDPOINT}amount=${amount}&category=${table[category]}&difficulty=${difficulty}&type=multiple`
  fetchingQuestions(url)
  }


  return <AppContext.Provider value={{waiting, loading, questions, index, correct, error, isModelOpen, nextQuestion, checkQuestion, closeModel,quiz, handleChange, handleSubmit}}>{children}</AppContext.Provider>
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
