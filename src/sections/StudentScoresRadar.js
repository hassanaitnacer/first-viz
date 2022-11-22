// prop-types
import PropTypes from "prop-types"

// react
import { useCallback, useEffect, useState } from "react"

// d3
import * as d3 from "d3"

// components
import { Select } from "../components/form"

const StudentScoresRadar = ({
  data,
  options = {
    width: 500,
    height: 500,
    colorScheme: d3.schemeTableau10,
    margin: {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    },
  },
}) => {
  const [selectedStudent, setSelectedStudent] = useState(data[0])

  const draw = useCallback(() => {
    const angleToCoordinate = (angle, value, scale, radarSize) => {
      let x = Math.cos(angle) * scale(value)
      let y = Math.sin(angle) * scale(value)
      return { x: radarSize / 2 + x, y: radarSize / 2 - y }
    }

    const getPathCoordinates = (data, features, scale, radarSize) => {
      let coordinates = []

      features.forEach((feature, i) => {
        const angle = Math.PI / 2 + (2 * Math.PI * i) / features.length
        coordinates.push(
          angleToCoordinate(angle, data[feature.value], scale, radarSize)
        )
      })

      return coordinates
    }

    const selectedStudents = [selectedStudent]
    const features = [
      {
        value: "arabic_language_score",
        abbrev: "ALS",
        fullForm: "Arabic Language Score",
      },
      {
        value: "college_score",
        abbrev: "CoS",
        fullForm: "College Score",
      },
      {
        value: "current_score",
        abbrev: "CuS",
        fullForm: "Current Score",
      },
      {
        value: "first_language_score",
        abbrev: "FLS",
        fullForm: "First Language Score",
      },
      {
        value: "math_score",
        abbrev: "MS",
        fullForm: "Math Score",
      },
      {
        value: "primary_score",
        abbrev: "PS",
        fullForm: "Primary Score",
      },
    ]

    const radarSize =
      Math.min(options.width, options.height) -
      options.margin.left -
      options.margin.right

    const color = d3.scaleOrdinal(
      selectedStudents.map((d) => d.code),
      options.colorScheme
    )

    /*
     * ------------------------------------------------
     * Removing Old Context
     * ------------------------------------------------
     */
    d3.select("#scoresRadarContainer svg").remove()

    /*
     * ------------------------------------------------
     * Creating a New Context
     * ------------------------------------------------
     */
    const svg = d3
      .select("#scoresRadarContainer")
      .append("svg")
      .attr("viewBox", `0 0 ${options.width} ${options.height}`)
      .attr("class", "max-w-md")

    const centeredGroup = svg
      .append("g")
      .attr(
        "transform",
        `translate(${options.margin.left} ${options.margin.top})`
      )

    // Plotting the Gridlines
    const gridlinesGroup = centeredGroup.append("g")
    const radialScale = d3
      .scaleLinear()
      .domain([0, 20])
      .range([0, radarSize / 2])
    const ticks = [0, 5, 10, 15, 20]

    gridlinesGroup
      .selectAll("circle")
      .data(ticks)
      .enter()
      .append("circle")
      .attr("cx", radarSize / 2)
      .attr("cy", radarSize / 2)
      .attr("fill", "none")
      .attr("stroke", "#d1d5db")
      .attr("r", radialScale)

    // Plotting the Axes
    centeredGroup.selectAll("line").data(features)

    features.forEach((feature, i) => {
      let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length
      let lineCoord = angleToCoordinate(angle, 20, radialScale, radarSize)
      let labelCoord = angleToCoordinate(angle, 23, radialScale, radarSize)

      centeredGroup
        .append("line")
        .attr("x1", radarSize / 2)
        .attr("y1", radarSize / 2)
        .attr("x2", lineCoord.x)
        .attr("y2", lineCoord.y)
        .attr("stroke", "#d1d5db")

      centeredGroup
        .append("text")
        .attr("x", labelCoord.x)
        .attr("y", labelCoord.y)
        .attr("text-anchor", "middle")
        .text(feature.abbrev)
        .append("title")
        .text(feature.fullForm)
    })

    // Plotting the Data
    selectedStudents.forEach((student) => {
      const coordinates = getPathCoordinates(
        student,
        features,
        radialScale,
        radarSize
      )

      const polygonGroup = centeredGroup.append("g")

      // Draw the path element
      polygonGroup
        .selectAll("polygon")
        .data([coordinates])
        .enter()
        .append("polygon")
        .attr("points", (d) => d.map((d) => [d.x, d.y].join(",")).join(" "))
        .attr("stroke", () => color(student.code))
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 1)
        .attr("fill", () => color(student.code))
        .attr("fill-opacity", 0.25)
    })

    // Plotting gridlines labels
    gridlinesGroup
      .selectAll("text")
      .data(ticks)
      .enter()
      .append("text")
      .attr("x", radarSize / 2)
      .attr("y", (t) => radarSize / 2 - radialScale(t))
      .attr("dy", "-0.5rem")
      .attr("fill", "#9ca3af")
      .text((t) => t)
  }, [options, selectedStudent])

  /**
   *
   */
  const handleStudentChange = useCallback(
    (e) => {
      setSelectedStudent(data.find((d) => d.code.toString() === e.target.value))
    },
    [data]
  )

  useEffect(() => {
    draw()
  }, [draw])

  return (
    <section className="py-12 sm:py-32 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="sm:text-center">
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Student Scores Radar
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            See how a student is doing across his/her scores (e.g., Arabic
            language, college, current, etc.).
          </p>
        </div>

        <div
          id="scoresRadarContainer"
          className="mt-12 flex justify-center items-center flex-col gap-y-12"
        >
          <Select
            id="scoresRadarStudent"
            onChange={handleStudentChange}
            options={data.map((d) => ({
              label: `Student ${d.code}`,
              value: d.code.toString(),
            }))}
            value={selectedStudent?.code}
          />
        </div>
      </div>
    </section>
  )
}

StudentScoresRadar.propTypes = {
  data: PropTypes.array.isRequired,
}

export default StudentScoresRadar
