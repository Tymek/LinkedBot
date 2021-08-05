/* eslint-disable no-underscore-dangle */
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  console.info('echo >>>', req.body)
  res.json(req.body)
}

export default handler
