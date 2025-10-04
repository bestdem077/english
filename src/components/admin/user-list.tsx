'use client';

import { useEffect, useState } from 'react';
import { getAllUsersWithProgress } from '@/app/admin/actions';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UserWithProgress {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
  points: number;
  level: number;
  dailyStreak: number;
}

export default function UserList() {
  const [users, setUsers] = useState<UserWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const fetchedUsers = await getAllUsersWithProgress();
        setUsers(fetchedUsers);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Could not load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>View user progress and data. Sorted by points.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <p>Loading user data...</p>}
        {error && <p className="text-destructive">{error}</p>}
        {!loading && (
          <>
            {/* Table for medium screens and up */}
            <div className="hidden md:block">
              <Table>
                <TableCaption>A list of all registered users and their progress.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                    <TableHead className="text-right">Level</TableHead>
                    <TableHead className="text-right">Daily Streak</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.uid}>
                      <TableCell className="font-medium">{user.email || 'N/A'}</TableCell>
                      <TableCell className="text-right">{user.points}</TableCell>
                      <TableCell className="text-right">{user.level}</TableCell>
                      <TableCell className="text-right">{user.dailyStreak}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Card layout for mobile screens */}
            <div className="space-y-4 md:hidden">
              {users.map((user) => (
                <Card key={user.uid} className="w-full">
                  <CardHeader>
                    <CardTitle className="truncate text-base">{user.email || 'N/A'}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm font-bold">{user.points}</p>
                      <p className="text-xs text-muted-foreground">Points</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{user.level}</p>
                      <p className="text-xs text-muted-foreground">Level</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{user.dailyStreak}</p>
                      <p className="text-xs text-muted-foreground">Streak</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
               <p className="pt-4 text-center text-sm text-muted-foreground">A list of all registered users and their progress.</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
