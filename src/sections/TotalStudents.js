// prop-types
import PropTypes from "prop-types"

// react
import { useCallback, useEffect, useState } from "react"

// d3
import * as d3 from "d3"

// components
import { Select } from "../components/form"

const ATTRIBUTES = [
  {
    value: "age",
    label: "Age",
  },
  {
    value: "gender",
    label: "Gender",
  },
  {
    value: "health_problems",
    label: "Health Problems",
  },
  {
    value: "homework",
    label: "Homework",
  },
  {
    value: "preschool",
    label: "Preschool",
  },
  {
    value: "work",
    label: "Work",
  },
  {
    value: "internal_external",
    label: "Internal/External",
  },
  {
    value: "mother_qualification",
    label: "Mother Qualification",
  },
  {
    value: "father_qualification",
    label: "Father Qualification",
  },
  {
    value: "mother_profession",
    label: "Mother Profession",
  },

  {
    value: "father_profession",
    label: "Father Profession",
  },

  {
    value: "divorced",
    label: "Divorced",
  },

  {
    value: "dead",
    label: "Dead",
  },

  {
    value: "help_with_homework",
    label: "Help with Homework",
  },

  {
    value: "speciality",
    label: "Speciality",
  },

  {
    value: "number_of_repetition",
    label: "Number of Repetition",
  },

  {
    value: "public_or_private",
    label: "Public/Private",
  },

  {
    value: "area",
    label: "Area",
  },

  {
    value: "electricity",
    label: "Electricity",
  },

  {
    value: "water",
    label: "Water",
  },

  {
    value: "pc",
    label: "PC",
  },

  {
    value: "books",
    label: "Books",
  },

  {
    value: "marital_status",
    label: "Marital Status",
  },

  {
    value: "motivation",
    label: "Motivation",
  },

  {
    value: "learning_style",
    label: "Learning Style",
  },

  {
    value: "study_situation",
    label: "Study Situation",
  },

  {
    value: "primary_score_range",
    label: "Primary Score",
  },

  {
    value: "college_score_range",
    label: "College Score",
  },

  {
    value: "current_score_range",
    label: "Current Score",
  },

  {
    value: "math_score_range",
    label: "Math Score",
  },

  {
    value: "arabic_language_score_range",
    label: "Arabic Language Score",
  },

  {
    value: "first_language_score_range",
    label: "First Language Score",
  },
]

const TotalStudents = ({
  data,
  options = {
    width: 300,
    height: 300,
    colorScheme: d3.schemeSpectral[10],
    cornerRadius: 15,
  },
}) => {
  const [selectedAttribute, setSelectedAttribute] = useState(ATTRIBUTES[0])

  const draw = useCallback(() => {
    if (!selectedAttribute) return

    const studentsByAttribute = d3.rollup(
      data,
      (d) => d.length,
      (d) => d[selectedAttribute.value]
    )

    const color = d3.scaleOrdinal(
      Array.from(studentsByAttribute.keys()),
      options.colorScheme
    )

    /*
     * ------------------------------------------------
     * Removing Old Context
     * ------------------------------------------------
     */
    d3.select("#totalStudentsChartContainer svg").remove()

    /*
     * ------------------------------------------------
     * Creating a New Context
     * ------------------------------------------------
     */
    const svg = d3
      .select("#totalStudentsChartContainer")
      .append("svg")
      .attr("viewBox", `0 0 ${options.width} ${options.height}`)
      .attr("class", "max-w-xs")

    /*
     * ------------------------------------------------
     * Constructing new pie and arc generators with custom settings
     * ------------------------------------------------
     */
    const pathsGroup = svg
      .append("g")
      .attr(
        "transform",
        `translate(${options.width / 2} ${options.height / 2})`
      )

    const pie = d3
      .pie()
      .value((d) => d[1])
      .sort(null)
      .padAngle(0.03)

    const arc = d3
      .arc()
      .innerRadius(options.width / 2 - options.cornerRadius)
      .outerRadius(options.width / 2)
      .cornerRadius(options.cornerRadius)

    /*
     * ------------------------------------------------
     * Creating paths using generated pie and arc
     * ------------------------------------------------
     */
    const paths = pathsGroup
      .selectAll("path")
      .data(pie(Array.from(studentsByAttribute.entries())))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data[0]))

    /*
     * ------------------------------------------------
     * Creating texts to hold details
     * ------------------------------------------------
     */
    const detailGroup = svg
      .append("g")
      .attr(
        "transform",
        `translate(${options.width / 2} ${options.height / 2})`
      )

    const valueText = detailGroup
      .append("text")
      .text(data.length)
      .attr("class", "text-middle text-6xl font-bold")

    const labelText = detailGroup
      .append("text")
      .text("Students")
      .attr("class", "text-middle fill-gray-500 capitalize")
      .attr("dy", "2rem")

    /*
     * ------------------------------------------------
     * Handling user events
     * ------------------------------------------------
     */
    paths
      .on("mouseover", (e, d) => {
        valueText.text(d.data[1])
        labelText.text(`${d.data[0]}`.toLowerCase())
      })
      .on("mouseleave", (e) => {
        valueText.text(data.length)
        labelText.text("Students")
      })
  }, [data, selectedAttribute, options])

  /**
   *
   */
  const handleAttributeChange = useCallback((e) => {
    setSelectedAttribute(
      ATTRIBUTES.find((attribute) => attribute.value === e.target.value)
    )
  }, [])

  useEffect(() => {
    draw()
  }, [draw])

  return (
    <section className="py-12 sm:py-32 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="sm:text-center">
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Total Number of Students by Attribute
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Below is a multi-data donut chart of the total number of students
            surveyed where you can choose an attribute, for example, gender.
          </p>
        </div>

        <div
          id="totalStudentsChartContainer"
          className="mt-12 flex justify-center items-center flex-col gap-y-12"
        >
          <Select
            id="totalStudentsAttribute"
            onChange={handleAttributeChange}
            options={ATTRIBUTES}
            value={selectedAttribute?.value}
          />
        </div>
      </div>
    </section>
  )
}

TotalStudents.propTypes = {
  data: PropTypes.array.isRequired,
}

export default TotalStudents
