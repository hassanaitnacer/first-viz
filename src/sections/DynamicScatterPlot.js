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
    value: "number_of_repetition",
    label: "Number of Repetition",
  },

  {
    value: "primary_score",
    label: "Primary Score",
  },

  {
    value: "college_score",
    label: "College Score",
  },

  {
    value: "current_score",
    label: "Current Score",
  },

  {
    value: "math_score",
    label: "Math Score",
  },

  {
    value: "arabic_language_score",
    label: "Arabic Language Score",
  },

  {
    value: "first_language_score",
    label: "First Language Score",
  },
]

const DynamicScatterPlot = ({
  data,
  options = {
    width: 500,
    height: 300,
    colorScheme: d3.schemeSpectral[10],
    margin: { top: 10, right: 10, bottom: 60, left: 60 },
    circleRadius: 5,
  },
}) => {
  const [selectedAttributes, setSelectedAttributes] = useState({
    x: ATTRIBUTES[0],
    y: ATTRIBUTES[1],
  })

  const draw = useCallback(() => {
    const xValues = data.map((d) => d[selectedAttributes.x.value])
    const yValues = data.map((d) => d[selectedAttributes.y.value])

    /*
     * ------------------------------------------------
     * Removing Old Context
     * ------------------------------------------------
     */
    d3.select("#dynamicScatterPlotChartContainer svg").remove()

    /*
     * ------------------------------------------------
     * Creating a New Context
     * ------------------------------------------------
     */
    const svg = d3
      .select("#dynamicScatterPlotChartContainer")
      .append("svg")
      .attr("viewBox", `0 0 ${options.width} ${options.height}`)
      .attr("class", "max-w-2xl")

    const innerWidth =
      options.width - options.margin.left - options.margin.right
    const innerHeight =
      options.height - options.margin.top - options.margin.bottom

    const containerGroup = svg
      .append("g")
      .attr(
        "transform",
        `translate(${options.margin.left} ${options.margin.top})`
      )

    /*
     * ------------------------------------------------
     * Creating the X-axis
     * ------------------------------------------------
     */
    const x = d3.scaleLinear().domain(d3.extent(xValues)).range([0, innerWidth])

    containerGroup
      .append("g")
      .attr("transform", `translate(0 ${innerHeight})`)
      .call(d3.axisBottom(x))

    containerGroup
      .append("text")
      .attr("x", innerWidth / 2)
      .attr("y", options.height - 20)
      .attr("class", "text-middle fill-gray-500 text-sm font-medium")
      .text(selectedAttributes.x.label)

    /*
     * ------------------------------------------------
     * Creating the Y-axis
     * ------------------------------------------------
     */
    const y = d3
      .scaleLinear()
      .domain(d3.extent(yValues))
      .range([innerHeight, 0])

    containerGroup.append("g").call(d3.axisLeft(y))

    containerGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -options.margin.left + 20)
      .attr("x", -innerHeight / 2)
      .attr("class", "text-middle fill-gray-500 text-sm font-medium")
      .text(selectedAttributes.y.label)

    /*
     * ------------------------------------------------
     * Plotting data
     * ------------------------------------------------
     */
    containerGroup
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d[selectedAttributes.x.value]))
      .attr("cy", (d) => y(d[selectedAttributes.y.value]))
      .attr("r", options.circleRadius)
      .attr("fill", "black")
      .attr("opacity", 0.3)
  }, [data, selectedAttributes, options])

  /**
   *
   */
  const handleAttributeChange = useCallback((e) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [e.target.name]: ATTRIBUTES.find(
        (attribute) => attribute.value === e.target.value
      ),
    }))
  }, [])

  useEffect(() => {
    draw()
  }, [draw])

  return (
    <section className="py-12 sm:py-32 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="sm:text-center">
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Relationship Between Two Variables
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Determine whether or not two variables have a relationship or
            correlation.
          </p>
        </div>

        <div
          id="dynamicScatterPlotChartContainer"
          className="mt-12 flex justify-center items-center flex-col gap-y-12"
        >
          <div className="flex justify-center items-center gap-6 flex-wrap">
            <Select
              id="dynamicScatterPlotXAttribute"
              name="x"
              onChange={handleAttributeChange}
              options={ATTRIBUTES}
              value={selectedAttributes.x.value}
            />
            <Select
              id="dynamicScatterPlotYAttribute"
              name="y"
              onChange={handleAttributeChange}
              options={ATTRIBUTES}
              value={selectedAttributes.y.value}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

DynamicScatterPlot.propTypes = {
  data: PropTypes.array.isRequired,
}

export default DynamicScatterPlot
