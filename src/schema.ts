
import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, uuid, varchar, boolean, real, timestamp, primaryKey } from "drizzle-orm/pg-core";

export const userRole = pgEnum("userRole" , ["ADMIN", "CLIENT"])

export const userSchema = pgTable("user",{
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name", {length: 255}).notNull(),
    email: varchar("email" , {length: 256}).notNull().unique(),
    age: integer("age").notNull().$type<12 | 24>(),
    role: userRole("userRole").default("CLIENT").notNull()
})

// 1 to 1 relationship
export const UserPreferencesTable = pgTable("userPreferences" , {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    emailUpdates: boolean("emailUpdates").default(false).notNull(),
    userId: uuid("userId").references(()=> userSchema.id, {onDelete: "cascade"}).notNull().unique()
})

// 1 to many
export const PostTables = pgTable("postTables",{
    id: uuid("id").notNull().primaryKey(),
    title: varchar("title",{length: 255}).notNull(),
    averageRating: real("averageRating").notNull().default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updateAt: timestamp("updatedAt").notNull().defaultNow(),
    authorId: uuid("authorId").references(() => userSchema.id , { onDelete : "cascade"}).notNull()
})

// many to many
export const CategoryTable = pgTable("categoryTable",{
    id: uuid("id").notNull().primaryKey(),
    name: varchar("name", {length: 255 }).notNull()
})

export const PostToCategoryTable = pgTable("postTocategory",{
    // not need for having unique id in this coz every single combination in this tablw will be unique as it contains to primary key from
    // two different tables
    // we can create a composte primary key 
    postId: uuid("postId").references(() => PostTables.id).notNull(),
    categoryId: uuid("categoryId").references(() => CategoryTable.id).notNull()
}, table => {
    return {
        pk: primaryKey({ columns: [table.postId , table.categoryId]})
    }
})


// SETTING UP RELATIONS
export const userSchemaRelations = relations(userSchema, ({one , many}) => ({
    userPrefernces: one(UserPreferencesTable),
    userPosts: many(PostTables)
}))


export const UserPreferencesTableRelations = relations(UserPreferencesTable , ({one}) => ({
    user: one(userSchema, {
        fields: [UserPreferencesTable.userId],
        references: [userSchema.id]
    })
}))


// always whenever we have a one relation we have to add fields and references
export const PostTableRelations = relations(PostTables, ({one , many}) => ({
    author: one(userSchema, {
        fields: [PostTables.authorId],
        references: [userSchema.id]
    }),
    postCategories: many(PostToCategoryTable)
}))

export const CategoryTableRelations = relations(CategoryTable , ({many}) => ({
    postCategories: many(PostToCategoryTable)
}))

export const PostToCategoryTableRelation = relations(PostToCategoryTable, ({one}) => ({
  posts: one(PostTables , {
    fields: [PostToCategoryTable.postId],
    references: [PostTables.id]
  }),
  categories : one(CategoryTable, {
    fields: [PostToCategoryTable.categoryId],
    references: [CategoryTable.id]
  })
}))