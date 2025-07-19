"use client"

import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { loginFormSchema, LoginFormSchemaType } from "@/schema/formschema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Page = () => {

  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const router = useRouter();
  const onSubmit = async ( values : LoginFormSchemaType ) => {
    
    await fetch("http://localhost:8080/api/user/login", {
      method: "POST",
      headers: {
        "Authoriztion": `Bearer ${process.env.PUBLIC_JWT_SECRET_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: values.email, password: values.password })
    }).then (result => {
      if(result.status === 200) {
        result.json().then(data => {
          localStorage.setItem("username", data.username);
          localStorage.setItem("jwttoken", data.token);
        });
        form.reset();
        router.push("/");
      }
    });
    
  }

  return (
    <>
      <div className="w-1/2 flex items-center justify-center">
        <Image
          src="/instagram-web-lox-image.png"
          alt="Instagram"
          width={400}
          height={600}
          className="object-contain"
        />
      </div>
      <div className="w-1/2 flex items-center justify-center">
          <Card className="w-full h-3/5 flex flex-col items-center justify-between border-none">
            <CardHeader className="w-4/5 h-1/5 flex flex-col items-center">
              <CardTitle className="text-3xl font-bold text-center font-sans mt-0 mb-12 px-12">Outstagram</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 w-4/5 justify-center">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="h-4/5 flex flex-col justify-between">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="h-1/5 flex-grow flex flex-col justify-center">
                        <FormControl>
                          <div className="h-3/5">
                            <Input
                              type="email"
                              placeholder="이메일을 입력하세요."
                              {...field}
                              className="h-full text-base"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  >
                  </FormField>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="h-1/5 flex-grow flex flex-col justify-center">
                        <FormControl>
                          <div className="h-3/5">
                            <Input
                              type="password"
                              placeholder="비밀번호를 입력하세요."
                              {...field}
                              className="h-full text-base"
                            />
                          </div>
                        </FormControl>
                        <FormMessage /> 
                      </FormItem>
                    )}
                  >
                  </FormField>
                  <Button variant="outline" type="submit" className="bg-blue-500 text-white w-full mt-2 h-1/5">
                    로그인
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="w-4/5 flex flex-col items-center">
              <p className="text-center text-sm text-gray-500 mt-6">
                계정이 없으신가요? <Link href="/registerPage" className="text-blue-500 font-semibold no-underline">가입하기</Link>
              </p>
            </CardFooter>
          </Card>
      </div>
    </>
  );
};

export default Page;