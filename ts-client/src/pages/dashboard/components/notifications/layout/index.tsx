// child components
import { ConnectionRequests } from "../user-requests";
import { RecipeNotifications } from "../recipe-notifications";
import { TestKitchenNotifications } from "../test-kitchen-notifications";

// ui components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const NotficationsLayout = () => {

  return (
    <Tabs defaultValue="connections" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="connections">Connections</TabsTrigger>
        <TabsTrigger value="recipes">Recipes</TabsTrigger>
        <TabsTrigger value="test-kitchen">Test Kitchen</TabsTrigger>
      </TabsList>
      <div className="flex flex-col divide-y grow">
        <TabsContent value="connections"><ConnectionRequests /></TabsContent>
        <TabsContent value="recipes"><RecipeNotifications /></TabsContent>
        <TabsContent value="test-kitchen"><TestKitchenNotifications /></TabsContent>
      </div>
    </Tabs>
  );
};