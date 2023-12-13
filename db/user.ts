import { User } from '@reactkit/entities/User'
import { DeleteCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { DescribeTableCommand } from '@aws-sdk/client-dynamodb'
import {
  getAttributeNameKey,
  getAttributeParams,
  getAttributeValueKey,
} from '@reactkit/dynamodb/attributes'
import { getPickParams } from '@reactkit/dynamodb/getPickParams'
import { dbDocClient } from '@reactkit/dynamodb/client'
import { updateItem } from '@reactkit/dynamodb/updateItem'
import { makeGetItem } from '@reactkit/dynamodb/makeGetItem'
import { getTableName } from './getTableName'
import { shouldBeDefined } from '@reactkit/utils/assert/shouldBeDefined'

export const getUserItemParams = (id: string) => ({
  TableName: getTableName('users'),
  Key: {
    id,
  },
})

export const getUser = makeGetItem<string, User>({
  tableName: getTableName('users'),
  getKey: (id: string) => ({ id }),
})

export const updateUser = async (id: string, fields: Partial<User>) => {
  return updateItem({
    tableName: getTableName('users'),
    key: { id },
    fields: {
      ...fields,
      updatedAt: Date.now(),
    },
  })
}

export function getUserByEmail<T extends (keyof User)[]>(
  email: string,
  attributes: T,
): Promise<Pick<User, T[number]> | null> {
  const recursiveProcess = async (
    lastEvaluatedKey?: any,
  ): Promise<Pick<User, T[number]> | null> => {
    const command = new ScanCommand({
      TableName: getTableName('users'),
      ExclusiveStartKey: lastEvaluatedKey,
      FilterExpression: `${getAttributeNameKey(
        'email',
      )} = ${getAttributeValueKey('email')}`,

      ...getAttributeParams({
        email,
      }),

      ...getPickParams([...attributes, 'email']),
    })
    const { Items, LastEvaluatedKey } = await dbDocClient.send(command)

    if (Items?.length) {
      return Items[0] as Pick<User, T[number]>
    }

    if (LastEvaluatedKey) {
      return await recursiveProcess(LastEvaluatedKey)
    }

    return null
  }

  return recursiveProcess()
}

export const deleteUser = (id: string) => {
  const command = new DeleteCommand(getUserItemParams(id))

  return dbDocClient.send(command)
}

export const getNumberOfUsers = async () => {
  const command = new DescribeTableCommand({
    TableName: getTableName('users'),
  })

  const tableInfo = await dbDocClient.send(command)

  return shouldBeDefined(tableInfo.Table?.ItemCount)
}

export const putUser = (user: Omit<User, 'updatedAt'>) => {
  const command = new PutCommand({
    TableName: getTableName('users'),
    Item: {
      ...user,
      updatedAt: Date.now(),
    },
  })

  return dbDocClient.send(command)
}
