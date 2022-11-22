// react
import { useState, useCallback, useEffect } from "react"

// d3
import { csv } from "d3"

// sections
import TotalStudents from "./sections/TotalStudents"
import DynamicScatterPlot from "./sections/DynamicScatterPlot"
import Me from "./sections/Me"

// utils
import { calcAge } from "./utils/datetime"
import { scoreRange } from "./utils/range"
import StudentScoresRadar from "./sections/StudentScoresRadar"
import CompateStudentsScoresRadar from "./sections/CompateStudentsScoresRadar"

const App = () => {
  const [data, setData] = useState()

  const loadData = useCallback(async () => {
    const res = await csv(
      "https://gist.githubusercontent.com/hassanaitnacer/7f7da265b9c9f826746e5878e05fd7bc/raw/3780d1c06a99d7dbe6f8ad473d81d962edde1640/academic-questionnaire.csv",
      (d) => ({
        ...d,
        gender: d.gender === "F" ? "Female" : "Male",
        age: `${calcAge(new Date(d.age))} years old`,
        arabic_language_score: +d.arabic_language_score,
        code: +d.code,
        college_score: +d.college_score,
        current_score: +d.current_score,
        first_language_score: +d.first_language_score,
        math_score: +d.math_score,
        number_of_repetition: +d.number_of_repetition,
        number_of_teachers: +d.number_of_teachers,
        primary_score: +d.primary_score,

        // additional fields
        primary_score_range: scoreRange(+d.primary_score),
        college_score_range: scoreRange(+d.college_score),
        current_score_range: scoreRange(+d.current_score),
        math_score_range: scoreRange(+d.math_score),
        arabic_language_score_range: scoreRange(+d.arabic_language_score),
        first_language_score_range: scoreRange(+d.first_language_score),
      })
    )

    setData(res)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (!data) return

  return (
    <div>
      <Me />
      <TotalStudents data={data} />
      <StudentScoresRadar data={data} />
      <DynamicScatterPlot data={data} />
      <CompateStudentsScoresRadar data={data} />
    </div>
  )
}

export default App
