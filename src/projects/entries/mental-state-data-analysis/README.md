# Overwatch Mental State Analysis & Data Visualisation in R

A data analysis and visualisation project investigating the relationship between
player mental state and match outcomes in competitive Overwatch.

The project uses **R and Quarto** to clean and explore match data, identify
meaningful relationships, and communicate the findings through a structured
data story and interactive visualisations.

## Project Overview

The analysis uses a dataset containing **3,299 competitive Overwatch matches**
and **46 variables**, including match results, player mental state, Skill Rating
(SR) changes, performance streaks, selected characters, roles, and match context.

Exploratory data analysis was used to identify useful patterns before developing
the final explanatory visualisations.

The main finding of the analysis is a strong association between negative mental
state ("tilt") and poorer match outcomes.

The resulting pattern can be summarised as:

**Poor outcome → negative mental state → higher loss risk → continued poor outcomes**

The analysis demonstrates association rather than causation.

## Technologies

- R
- RStudio
- Quarto
- tidyverse
- ggplot2
- Plotly

## View the Project

### [View the Full Data Story](https://cian-anderson.github.io/Overwatch-Mental-State-Analysis-Data-Visualization-in-R/)

The rendered Quarto project contains the complete exploratory analysis,
interactive visualisations, findings, methodology, and discussion.

## Repository Structure

```text
.
├── README.md
├── analysis.qmd
├── analysis.html
└── data/
    └── overwatch_competitions_data_clear.csv
```
