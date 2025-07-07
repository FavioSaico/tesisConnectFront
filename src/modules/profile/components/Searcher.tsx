import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Search } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router"

const formSchema = z.object({
  buscador: z.string(),
})

export const Searcher = () => {
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") ?? "";

  // useform se basa en el tipo definido en el schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buscador: searchTerm
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    if(values.buscador === '') {

    }else{
      console.log(encodeURIComponent(values.buscador))
      navigate(`/search?q=${encodeURIComponent(values.buscador)}`);
    }

  }

  return (
    <div className="max-w-80 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex border rounded-[20px] justify-between">
            <FormField
              control={form.control}
              name="buscador"
              render={({ field }) => (
                <FormItem className="flex flex-1">
                  <FormControl>
                    <Input placeholder="Buscar" type="text" {...field} className="border-0 shadow-none focus-visible:ring-0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="outline" size="icon" className="border-0 shadow-none focus-visible:ring-0 rounded-[20px] cursor-pointer">
              <Search />
            </Button>
          </form>
        </Form>
    </div>
  )
}