import { sql } from "drizzle-orm";
import { db } from "./db";
import { UserPreferencesTable, userSchema } from "./schema";

async function main() {
 // CRUD OPERATIONS

 // -> CREATE
//  const user = await db.insert(userSchema).values([{
//   name: "Ansh",
//   email: "ansh@test.com",
//   age: 24,
//  },{
//   name: "Jhon doe",
//   email: "doe@test.com",
//   age: 12,
//  } ]).returning({
//   id: userSchema.id,
//   name: userSchema.name
//  })
//  console.log(user)


// await db.insert(UserPreferencesTable).values({
//   emailUpdates: true,
//   userId: "0e29cdb7-91e5-4180-8d00-cf2c49b85c03"
// })
// return

 // -> READ
 const userEmails = await db.query.userSchema.findMany({
  columns: {email: true , name: true},
  extras: { lowerCaseName: sql<string>`lower(${userSchema.name})`.as ("lowerCaseName")},
  with: { userPrefernces: true , userPosts : {
    with: {
      postCategories: true
    }
  }}
 })
 console.log(userEmails)
}

main()