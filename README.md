# Clarify AI

Simple written surveys struggle to get participants to offer detailed answers.  
ClarifyAI guides participants using leading questions, getting more detail and creating summaries for valuable insights.

<p align="center">
  <a href="https://www.clarifyai.com" target="_blank">
    <img src="https://img.shields.io/badge/Visit-ClarifyAI-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Visit ClarifyAI Website" />
  </a>
</p>

## Built By

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/specialsyt">
        <img src="https://github.com/specialsyt.png" width="100px;" alt="Shivam Singh"/>
        <br />
        <sub><b>Shivam Singh</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/mliu2003">
        <img src="https://github.com/mliu2003.png" width="100px;" alt="Max Liu"/>
        <br />
        <sub><b>Max Liu</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ElliotRoe">
        <img src="https://github.com/ElliotRoe.png" width="100px;" alt="Elliot Roe"/>
        <br />
        <sub><b>Elliot Roe</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/TigerPeng2">
        <img src="https://github.com/TigerPeng2.png" width="100px;" alt="Tiger Peng"/>
        <br />
        <sub><b>Tiger Peng</b></sub>
      </a>
    </td>
  </tr>
</table>

## Inspiration

The motivation to pursue this project was born out of a specific need of one of our members, Elliot, to collect end-of-day qualitative data from a number of employees who oversaw educational summer camps. The information to be collected concerning student engagement, safety, and potential pain points was critical to know to improve the organization.
However, filling out a paper survey with the same boilerplate questions became a repetitive chore, often shirked off to the last minute as a low-priority task.

Semi-structured interviews are a technique often used in psychology to gather rich qualitative data from a participant. The technique involves guiding the participant through a discussion using a number of prewritten questions, each ideally leading the conversation to hit on several key points. This heavily engages the skills of the interviewer, requiring them to pull on threads of provided information, build rapport with the participant, and ultimately extract the information desired.
However, this face-to-face format limits the survey's reach, as interviewers unfortunately cannot engage in mitosis. If you aim to perform this qualitative data collection regularly or throughout a larger organization, you are heavily limited by manpower and time.

On the participant side, there is the issue of survey fatigue.
Surveys that require you to fill out countless short answer responses, or _worse_ sliders from "Mostly Disagree" to "Mostly Agree", can often be intimidating and are unlikely to invite high-quality, detailed responses.

ClarifyAI helps to streamline the process of gathering qualitative feedback by prompting the participant to provide more information through the use of guiding questions.

## What it does

In traditional face-to-face informational interviews, the interviewer could build rapport with the participant and pull on interesting threads of information.
However, this is a manpower and time-intensive process, especially if you aim to perform it regularly or throughout a larger organization.

**Interview Designer**  
ClarifyAI allows the interview designer to specify questions to ask, along with topics that they would like the response to hit. Clarify will perform the role of the interviewer, inquiring further into topics of interest.

There are currently two main question types, informational and deep-dive.  
_Informational questions_ are essentially replacements for standard survey boxes. You might use this for name, age, etc.  
_Deep-dive questions_ are where ClarifyAI really adds value, leading the participant through the outlined goals, expressing interest in knowing more, and following up on previously provided information to clarify specific areas of interest.
Through our survey builder you get to select the initial question as long as a number of goals that you would like ClarifyAI to guide your participants through.

**User Side**  
On the user end, we try to avoid the problem of survey fatigue by engaging the participant in more natural conversation. Instead of placing the burden on them to think of unique ways to respond to the same prompt, ClarifyAI follows up with fully voiced prompts, engaging with subjects the participant has already indicated are directly relevant to them.

## How we built it

There were three main components of this project. The first component was to build out all of the infrastructure around our website. We decided to use Vercel to host for a variety of reasons including speed, ease of use, and ecosystem. We also opted to use Vercel KV as our underlying database because its support for object storage allows us to iterate fast while not sacrificing query performance.
The second component was the prompt engineering to enable the AI to generate relevant followup questions that were neither too pressing nor too vague, as well as ways to ensure that the goals were hit. On the other side of the spectrum, we also had to iterate the prompts and develop a set of heuristics to ensure it did not repeatedly press the same point and cause discomfort for the participant. We used Groq-hosted Llama models because of their incredibly fast inference times, especially compared with competitors like OpenAI.
Finally, our last hurdle was implementing our speech to text and text to speech functionality on the user side. We decided to stream our audio to generate transcripts and generate speech to play using Deepgram, with infrastructure setup to hot-swap OpenAI models if needed. OpenAI models tend to sound more realistic, however given the high inference times, we opted against them.

## Challenges we ran into

One of the most challenging parts of this project was ensuring that the LLM was capable of distinguishing when the goals of a deep-dive question were sufficiently met. Because the nature and job of an LLM is to generate more text, getting it to stop required a lot of prompt engineering and heuristics.

## Accomplishments that we're proud of

The moment of watching each of our discrete systems connect to each other to form a complete app was glorious. Some of the moments we felt the most proud of:

- The first time we spoke to Clarify and Clarify spoke back
- The first time Clara the Cat congratulated us for a completed survey

## What we learned

There were a lot of lessons in prompt engineering. It was quite the challenge to get the model to recognize when to stop. A long process of trial and error lead us to a series of prompts and manual guardrails that we were happy with.

We also pursued a new technology, Deepgram, for our voice interface, providing experience using its live transcription and TTS APIs.

## What's next for ClarifyAI

We hope to build out Clarify in order to perform class surveys, analyze public perception, etc.  
This would involve polishing up the front-end, developing some features left on the hackathon to-do list, and evaluating what else we might need for the best possible experience for both the interviewer and interviewee.
