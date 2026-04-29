-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'student');
CREATE TYPE kiwify_status AS ENUM ('active', 'inactive', 'canceled', 'overdue', 'refunded');

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role user_role DEFAULT 'student'::user_role NOT NULL,
  kiwify_status kiwify_status DEFAULT 'inactive'::kiwify_status NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create stl_files table
CREATE TABLE stl_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  thumbnail_url TEXT,
  file_url TEXT NOT NULL,
  downloads_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create downloads_history table
CREATE TABLE downloads_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  file_id UUID REFERENCES stl_files(id) ON DELETE CASCADE NOT NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stl_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads_history ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON profiles FOR SELECT 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- STL Files Policies
CREATE POLICY "Anyone can view stl_files" 
  ON stl_files FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage stl_files" 
  ON stl_files FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Downloads History Policies
CREATE POLICY "Users can view their own downloads" 
  ON downloads_history FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own downloads" 
  ON downloads_history FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all downloads" 
  ON downloads_history FOR SELECT 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create a profile when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Setup Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('stl-files', 'stl-files', false);

-- Storage Policies for Thumbnails (Public read, Admin write)
CREATE POLICY "Thumbnails are publicly accessible." ON storage.objects FOR SELECT USING (bucket_id = 'thumbnails');
CREATE POLICY "Admins can upload thumbnails." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'thumbnails' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update thumbnails." ON storage.objects FOR UPDATE USING (bucket_id = 'thumbnails' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete thumbnails." ON storage.objects FOR DELETE USING (bucket_id = 'thumbnails' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Storage Policies for STL Files (Student read, Admin write)
CREATE POLICY "Active students can download STL files." ON storage.objects FOR SELECT USING (bucket_id = 'stl-files' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND kiwify_status = 'active'));
CREATE POLICY "Admins can download STL files." ON storage.objects FOR SELECT USING (bucket_id = 'stl-files' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can upload STL files." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'stl-files' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update STL files." ON storage.objects FOR UPDATE USING (bucket_id = 'stl-files' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete STL files." ON storage.objects FOR DELETE USING (bucket_id = 'stl-files' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
