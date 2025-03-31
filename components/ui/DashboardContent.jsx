import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Students</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">1,250</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Teachers</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">85</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classes Running</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">42</CardContent>
      </Card>
    </div>
  );
}
