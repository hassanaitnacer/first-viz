const DynamicScatterPlot = () => {
  return (
    <section className="py-12 sm:py-32 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center md:flex-row md:justify-between gap-24">
          <div>
            <h1 className="text-3xl font-bold">
              Hi there, I'm{" "}
              <a
                className="bg-gradient-to-br from-sky-500 to-cyan-400 bg-clip-text text-transparent"
                href="https://github.com/hassanaitnacer"
                target="_blank"
                rel="noreferrer"
              >
                Hassan
              </a>{" "}
              👋
            </h1>
            <p className="mt-6 text-xl leading-9">
              Currently, I am a student in MSc Big Data and Artificial
              Intelligence at
              <a
                className="text-sky-500 hover:underline"
                href="http://www.fpt.ac.ma/"
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                the faculty of Taroudant.
              </a>{" "}
              I’m interested in software development, Big Data, and AI.
              <br />
              Below is my work on{" "}
              <a
                className="text-sky-500 hover:underline"
                href="https://classroom.google.com/c/NTU2Mzk0MzE2ODQ0/a/NTY5MzM5MTY5NTA4/details"
                target="_blank"
                rel="noreferrer"
              >
                "Challenge 1: First viz"
              </a>{" "}
              assignement by Prof. El Hajji on Google Classroom.
            </p>
          </div>
          <div className="shrink-0">
            <img
              className="h-80 w-80 rounded-full"
              src="https://avatars.githubusercontent.com/u/108420918"
              alt="Avatar"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default DynamicScatterPlot
