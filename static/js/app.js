
// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metaField = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let filterData = metaField.filter(sampleNum => sampleNum.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panelID = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panelID.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (let key in filterData[0]){
      panelID.append('p').text(`${key}: ${filterData[0][key]}`);
  
      }
    });
  }

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samplesField = data.samples;

    // Filter the samples for the object with the desired sample number
    let fileredSamples = samplesField.filter(SampleNum => SampleNum.id == sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otuID = fileredSamples[0].otu_ids;
    let otuLabels = fileredSamples[0].otu_labels;
    let sample_values = fileredSamples[0].sample_values

    // Build a Bubble Chart
    let trace = {
      x: otuID,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otuID,
        colorscale: 'Earth'
      },
      text: otuLabels
    };

    let layout = {
      title: 'Bacteria Cultures Per Sample',
      margin: { t: 30 },
      hovermode: 'closest',
      xaxis: { title: 'OTU ID' }
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", [trace], layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otuID.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace2 = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      type: 'bar',
      orientation: 'h',
      text: otuLabels.slice(0, 10).reverse()
    };

    let layout2 = {
      title: 'Top 10 Bacteria Cultures Found',
      margin: { t: 30, l: 150 }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", [trace2], layout2);

  });
}
 



// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });


    // Get the first sample from the list
    let firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
