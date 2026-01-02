-- 기존 테이블 초기화 (필요시)
DROP TABLE IF EXISTS feedback_history CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS assignment_deployments CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS class_members CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS academy_members CASCADE;
DROP TABLE IF EXISTS academies CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS platform_role CASCADE;
DROP TYPE IF EXISTS academy_member_role CASCADE;
DROP TYPE IF EXISTS target_type CASCADE;
DROP TYPE IF EXISTS submission_status CASCADE;
DROP TYPE IF EXISTS feedback_type CASCADE;
DROP TYPE IF EXISTS inquiry_status CASCADE;

-- 1. ENUM 타입 정의
CREATE TYPE platform_role AS ENUM ('admin', 'manager', 'user');
CREATE TYPE academy_member_role AS ENUM ('teacher', 'student');
CREATE TYPE target_type AS ENUM ('class', 'student');
CREATE TYPE submission_status AS ENUM ('pending', 'submitted', 'reviewing', 'resubmit_requested', 'completed');
CREATE TYPE feedback_type AS ENUM ('comment', 'resubmit_request', 'approval');
CREATE TYPE inquiry_status AS ENUM ('pending', 'approved', 'rejected', 'on_hold');

-- 2. 유저 프로필 (최소 정보)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  platform_role platform_role NOT NULL DEFAULT 'user',
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 학원 관리
CREATE TABLE academies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  manager_id UUID REFERENCES profiles(id), -- 학원장
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 학원 멤버 (관계 테이블) - 여기서 선생님/학생이 결정됨
CREATE TABLE academy_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID REFERENCES academies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role academy_member_role NOT NULL,
  status TEXT DEFAULT 'active', -- active, invited, etc.
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(academy_id, user_id)
);

-- 5. 반 관리
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID REFERENCES academies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. 반 소속 학생 (academy_members 중 student인 사람만 들어감)
CREATE TABLE class_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(class_id, user_id)
);

-- 7. 숙제 (선생님이 작성)
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID REFERENCES academies(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  is_template BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. 숙제 배포 및 제출현황 (이하 동일 구조)
CREATE TABLE assignment_deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  target_type target_type NOT NULL,
  target_id UUID NOT NULL, 
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id UUID REFERENCES assignment_deployments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status submission_status DEFAULT 'pending',
  answers JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE feedback_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  feedback_type feedback_type NOT NULL DEFAULT 'comment',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  content TEXT,
  status inquiry_status DEFAULT 'pending',
  admin_comment TEXT,
  processed_by UUID REFERENCES profiles(id),
  processed_at TIMESTAMPTZ,
  academy_id UUID REFERENCES academies(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 자동 프로필 생성 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, platform_role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    COALESCE((new.raw_user_meta_data->>'platform_role')::platform_role, 'user')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();