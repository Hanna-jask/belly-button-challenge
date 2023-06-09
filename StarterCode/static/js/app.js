// constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Use d3 to pull in the data
d3.json(url).then(function(data) {
  console.log(data);
});

// Create function to initalize dashboard
function init() {

    // D3 to create the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names and populate the drop-down selector
    d3.json(url).then((data) => {
        
        // Set a variable for the sample names
        let names = data.names;

        // Add  samples to dropdown menu
        names.forEach((id) => {

            // Log the value of id for each iteration of the loop
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        let sample_one = names[0];
        console.log(sample_one);

        // the initial plots
        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);

    });
};

// Function that populates metadata info
function buildMetadata(sample) {

    // Use d3 to pull in the data
    d3.json(url).then((data) => {

        // Metadata
        let metadata = data.metadata;

        // Filter based on the value of the sample
        let value = metadata.filter(result => result.id == sample);

        // Create a reference point to an array that takes in the id key equal to the sample parameter
        console.log(value)

        // Create a new reference point indexing the 0 position of the previous reference point
        let valueData = value[0];

        // Use `.html("") to clear any existing metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {

            // Appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Bar Chart
function buildBarChart(sample) {

    // Use d3 to pull in the data
    d3.json(url).then((data) => {

        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);
        let valueData = value[0];

        // Gather data for values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;
        console.log(otu_ids,otu_labels,sample_values);

        // Display in decending order
        let y = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let x = sample_values.slice(0,10).reverse();
        
        // Trace
        let trace = {
            x: x,
            y: y,
            type: "bar",
            marker: {
                color: "#FF69B4"},
            orientation: "h"
        };

        // Layout
        let layout = {
            title: "Top 10 OTUs"
        };

        // Plot Bar Chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Bubble Chart
function buildBubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);
        let valueData = value[0];

        // Gather data for values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;
        console.log(otu_ids,otu_labels,sample_values);
        
        // Trace
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Picnic"
            }
        };

        // Layout
        let layout = {
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Plot Bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Create function called optionChanged that takes in a parameters called newSample
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Use buildMetadata function with newSample as parameter 
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
};

//  Initialize the dashboard
init();
