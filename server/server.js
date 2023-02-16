import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `
      You have 18 weeks of parental leave with Deloitte.
      Our Policy is inclusive of all types of families including birth, adoptive, surrogate, foster and same-sex parents. We encourage all parents, regardless of gender, to take an active role in the caring responsibilities for their families.
      18 weeks of paid parental leave for everyone: no more maternity, paternity, primary or secondary carer labels.
      Continued superannuation contributions on unpaid parental leave (up to 52 weeks), to provide greater financial security for the future as well as addressing the gender pay gap.
      Extended time to take parental leave, with the option to spread your parental leave over 36 months and take it flexibly to suit each families unique needs.
      Co-parenting - both parents may access paid and unpaid parental leave at the same time, or at different times.
      Always include reference to important to read: https://www2.deloitte.com/au/en/pages/careers/articles/deloitte-families.html
      Employee benefits: Deloitte offers a range of great deals across healthcare, travel, entertainment, health & fitness, household appliances, motor vehicles and banking. We also offer Medibank or BUPA Corporate deals providing discounts on health insurance for our people and their families.
      Supporting families with school aged children: Our people can now use TimeFlex to work flexibly during school holidays, working their usual weekly hours over fewer days (working up to a maximum of 12 hours on any given day, limited to 10 hours for Award employees). They may may wish to use LeaveFlex to purchase extra annual leave to use during school holidays; or could use PlaceFlex to work from a different location during the holidays.



      ${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 4000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))