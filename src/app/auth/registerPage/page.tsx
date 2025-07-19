"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerFormSchema, RegisterFormSchemaType } from "@/schema/formschema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const Page = () => {

    const form = useForm<RegisterFormSchemaType>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    })


    const router = useRouter();
    const onSubmit = async (values : RegisterFormSchemaType) => {

        await fetch("http://localhost:8080/api/user/register", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({ username : values.username, email : values.email, password : values.password})
        }).then(result => {
            if(result.status === 201) {
                form.reset();
                router.push("/loginPage");
            }
        })
    }

    return (
        <div className="flex justify-center items-center h-screen w-full">
            <div className="flex flex-col items-center h-4/5 w-2/5 border bg-gray-50 pt-5">
                <h1 className="font-extrabold text-black-900 py-5">Outstagram</h1>
                <p className="text-gray-700">친구들의 사진과 동영상을 보려면 가입하세요!!</p>
                <div className="w-full flex flex-col flex-1 items-center justify-center p-0">
                    <Card className="w-full h-3/5 flex flex-col items-center justify-between gap-15 border-none">
                        <CardContent className="flex flex-col flex-1 w-4/5">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="h-4/5 flex flex-col">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem className="h-1/12 flex-grow flex flex-col">
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
                                <FormItem className="h-1/10 flex-grow flex flex-col">
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
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                <FormItem className="h-1/12 flex-grow flex flex-col">
                                    <FormControl>
                                    <div className="h-3/5">
                                        <Input
                                        type="text"
                                        placeholder="유저명을 입력하세요."
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
                            <Button variant="outline" type="submit" className="bg-sky-500 w-full mt-2 h-1/5 text-white">
                                회원가입
                            </Button>
                            </form>
                        </Form>
                        </CardContent>
                        <CardFooter className="w-4/5 flex flex-col items-center">
                        <p className="text-center text-sm text-gray-500 mt-6">
                            계정이 이미 있으신가요? <Link href="/loginPage" className="text-blue-500 font-semibold no-underline">로그인하기</Link>
                        </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Page;