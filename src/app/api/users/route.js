import { NextResponse } from "next/server";

const { Pool } = require("pg");

console.log("reach");
const client = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5000,
  password: "abdulrehman344",
  database: "postgres",
});
client.connect();

export const GET = async () => {
  try {
    const response = await client.query("SELECT * FROM users");
    return NextResponse.json({
      message: "Succesffuly Todo geting",
      users: response.rows,
    });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({
      message: "something went wrong Todo geting",
      error: JSON.stringify(error),
    });
  }
};
export const POST = async (req) => {
  try {
    const id = Math.floor(10000 + Math.random() * 9000000).toString();
    const { fullname, email, file } = await req.json();
    const result = await client.query(
      "INSERT INTO users (fullname, email,file,id) VALUES ($1, $2,$3,$4) RETURNING *",
      [fullname, email, file, id]
    );

    return NextResponse.json({
      message: "Successfully created user",
      user: result.rows[0],
    });
  } catch (error) {
    console.log("Error creating user:", error);
    return NextResponse.json({
      message: "Something went wrong creating user",
      error: JSON.stringify(error),
    });
  }
};

export const DELETE = async (req) => {
  try {
    const body = await req.json();

    if (body.id) {
      const result = await client.query("DELETE FROM users WHERE id=$1", [
        body.id,
      ]);
      return NextResponse.json({ message: "Successfully deleted" });
    } else {
      return NextResponse.json({ message: "No ID provided" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: JSON.stringify(error),
      },
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const { fullname, email, file } = await req.json();

    if (id) {
      const result = await client.query(
        "UPDATE users SET fullname=$1,email=$2,file=$3 WHERE id=$4 RETURNING *",
        [fullname, email, file, id]
      );

      return NextResponse.json({ message: "Successfully Updated" });
    } else {
      return NextResponse.json({ message: "No ID provided" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: JSON.stringify(error),
      },
      { status: 500 }
    );
  }
};
